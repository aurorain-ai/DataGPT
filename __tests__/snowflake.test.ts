// Note: The test cases here test both local and remote Snowflake APIs.
// Please run "npm run test:custom" on another terminal before testing.
import * as dotenv from 'dotenv';
dotenv.config();

import { querySnowflake } from "../src/server/snowflake";
import { querySnowflakeAPI } from '../src/services/snowflake-service';
import { getQueryOperatorStats as getQueryOperatorStatsExt } from "../src/utils/query-opstats";


async function testQuerySnowflake() {
  console.log('Snowflake: testing............................');
  console.log("process.env.SNOWFLAKE_ACCOUNT:", process.env.SNOWFLAKE_ACCOUNT);
  console.log("process.env.SNOWFLAKE_USERNAME:", process.env.SNOWFLAKE_USERNAME);

  console.log('Snowflake: querying............................');
  const results = await querySnowflake('SELECT count(*) FROM customer');
  console.log('Snowflake query results:', results);
}

async function getQueryOperatorStats() {
  // Step 1: Get the last query ID
  const queryIdQuery = 'SELECT last_query_id();';
  const queryIdResult = await querySnowflake(queryIdQuery);
  const lastQueryId = queryIdResult[0]['LAST_QUERY_ID()'];
  console.log("lastQueryId: ", lastQueryId);

  // Step 2: Use the query ID to get the query operator stats
  const operatorStatsQuery = `SELECT * FROM TABLE(get_query_operator_stats('${lastQueryId}'));`;
  const operatorStatsResult = await querySnowflake(operatorStatsQuery);

  console.log("get_query_operator_stats: ", operatorStatsResult);
}

async function testQuerySnowflakeExt() {
  console.log('Snowflake: ext querying');
  const results = await querySnowflakeAPI(
    `SELECT EXTRACT(YEAR FROM O_ORDERDATE) AS OrderYear, COUNT(DISTINCT O_CUSTKEY) AS CustomerCount
    FROM "SNOWFLAKE_SAMPLE_DATA"."TPCH_SF1"."ORDERS"
    GROUP BY OrderYear
    ORDER BY OrderYear;`
  );
  console.log('Snowflake ext query results:', results);
}

async function main() {
  try {
    console.log('Running testQuerySnowflake...');
    await testQuerySnowflake();
    console.log('testQuerySnowflake completed.');

    console.log('Running getQueryOperatorStats...');
    await getQueryOperatorStats();
    console.log('getQueryOperatorStats completed.');

    console.log('Running testQuerySnowflakeExt...');
    await testQuerySnowflakeExt();
    console.log('testQuerySnowflakeExt completed.');

    console.log('Running getQueryOperatorStatsExt...');
    await getQueryOperatorStatsExt();
    console.log('getQueryOperatorStatsExt completed.');
  } catch (error) {
    console.error("Error while executing tests:", error);
  }
}

main();
