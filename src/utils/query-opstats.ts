import { querySnowflakeAPI } from '../services/snowflake-service';

export async function getQueryOperatorStats() : Promise<any> {
  // Step 1: Get the last query ID
  const queryIdQuery = 'SELECT last_query_id();';
  const queryIdResult = await querySnowflakeAPI(queryIdQuery);
  const lastQueryId = queryIdResult[0]['LAST_QUERY_ID()'];
  console.log("lastQueryId: ", lastQueryId);

  // Step 2: Use the query ID to get the query operator stats
  var operatorStatsResult = "";
  if (lastQueryId) {
    const operatorStatsQuery = `SELECT * FROM TABLE(get_query_operator_stats('${lastQueryId}'));`;
    operatorStatsResult = await querySnowflakeAPI(operatorStatsQuery);
    console.log("get_query_operator_stats: ", operatorStatsResult);
  }

  return operatorStatsResult;
}
