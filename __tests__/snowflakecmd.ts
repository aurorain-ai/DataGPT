import * as readline from 'readline';
import * as dotenv from 'dotenv';
dotenv.config();

import { querySnowflake } from "../src/server/snowflake";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  // Add a delay (2000ms) before printing the first prompt
  await new Promise<void>((r) => setTimeout(r, 2000));
  while (true) {
    await new Promise<void>((resolve) => {
      rl.question('Enter SQL query: ', async (sqlText) => {
        if (!sqlText.trim()) {
          console.log('Exiting...');
          rl.close();
          resolve();
          return;
        }

        try {
          const result = await querySnowflake(sqlText);
          console.log('Result:', result);
        } catch (err) {
          console.error('querySnowflakeCmd Error:', err);
        }

        resolve();
      });
    });
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
