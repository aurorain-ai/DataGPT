import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RequestBody } from "../../../utils/interfaces";
import AgentService from "../../../services/agent-service";
import { querySnowflakeAPI } from '../../../services/snowflake-service';
import { getQueryOperatorStats } from "../../../utils/query-opstats";

const MAX_TUNING: number = process.env.LLM_SQL_TUNING_MAX_TIMES ? parseInt(process.env.LLM_SQL_TUNING_MAX_TIMES) : 3;
const COMP_LEVEL_THRESHOLD: number = process.env.SQL_COMPLEXITY_LEVEL_THRESHOLD ? parseInt(process.env.SQL_COMPLEXITY_LEVEL_THRESHOLD) : 3;


export const config = {
  runtime: "edge",
};

function isSQLOptRequest(text: string | null | undefined) {
  if (!text || text.trim().length === 0) {
      return false;
  }
  let trimmedText = text.trim().toLowerCase();
  if (trimmedText.startsWith('opt:') || trimmedText.startsWith('ops:') || trimmedText.startsWith('optim')) {
      return true;
  } else {
      return false;
  }
}

const fineTuneSql = async (modelSettings: any, goal: any) => {
  let num = 0;
  let sqlStmt;
  let pruning_result;
  let comp_level = COMP_LEVEL_THRESHOLD;
  while (num++ < MAX_TUNING && comp_level >= COMP_LEVEL_THRESHOLD) {
    console.log("Running sqlTuneAgent: ", num);
    console.time("AgentService.sqlTuneAgent1");
    const t_res = await AgentService.sqlTuneAgent(modelSettings, goal, pruning_result);
    console.timeEnd("AgentService.sqlTuneAgent1");
    // console.log("AgentService.sqlTuneAgent:", t_res);
    sqlStmt = t_res.main_SQL;
    comp_level = t_res.complexity_level;
    if (comp_level >= COMP_LEVEL_THRESHOLD && t_res.pruning_SQL) {
      console.log("sqlTuneAgent: query pruning_SQL: ", t_res.pruning_SQL);
      console.time("querySnowflakeAPI1");
      pruning_result = await querySnowflakeAPI(t_res.pruning_SQL)
      console.timeEnd("querySnowflakeAPI1");
    }
  }
  return sqlStmt;
}

const handler = async (request: NextRequest) => {

  console.log("startHandler---");

  // queryDatastore
  try {
    // step 1: get a statement from client
    const { modelSettings, goal } = (await request.json()) as RequestBody;
    console.log("startHanlder statement:", goal);

    // step 2: fine-tune SQL for understanding ops
    let sqlStmt;

    if (isSQLOptRequest(goal)) {
      sqlStmt = await fineTuneSql(modelSettings, goal);
    }
    else {
      console.time("AgentService.sqlQueryAgent1");
      // Based on test result, AgentService.sqlQueryAgent is 2~3 times faster than AgentService.sqlTuneAgent.
      // The speed is likely related to the question numbers since sqlQueryAgent has one question but sqlTuneAgent has three.
      sqlStmt = await AgentService.sqlQueryAgent(modelSettings, goal);
      console.timeEnd("AgentService.sqlQueryAgent1");
    }

    // step 3: query snowflake
    console.time("querySnowflakeAPI3");
    let data = await querySnowflakeAPI(sqlStmt);
    console.timeEnd("querySnowflakeAPI3");

    // step 4: Fine-tune SQL again for query failures
    if (data && typeof data === 'object' && data.error) {
      console.error("Fine-tuning for querySnowflakeAPI error: ", data);

      // step 4.1 get_query_operator_stats
      const queryOpsStats = await getQueryOperatorStats();

      // step 4.2: fine-tune SQL from LLM
      console.time("AgentService.sqlQueryAgent5");
      let newSQLStmt = await AgentService.sqlQueryAgent(modelSettings, goal, sqlStmt, data.error, queryOpsStats);
      console.timeEnd("AgentService.sqlQueryAgent5");
      console.log("AgentService.sqlQueryAgent fine tuned:", newSQLStmt);

      const newSQL = newSQLStmt.trim().toLowerCase();
      const oldSQL = sqlStmt.trim().toLowerCase();

      if (newSQL === oldSQL) {
        console.warn("Same fine-tuned SQL statement, skipping it.");
      }
      else {
        // step 4.3: query snowflake again
        console.time("querySnowflakeAPI5");
        data = await querySnowflakeAPI(newSQLStmt);
        console.timeEnd("querySnowflakeAPI5");
        console.log("querySnowflakeAPI fine-tuned return:", data);
        sqlStmt = newSQLStmt;
      }
    }

    return NextResponse.json({
      sql: sqlStmt,
      result: data,
    });
  } catch (err) {
    console.error('Error executing query:', err);
  }
  return NextResponse.error();

};

export default handler;
