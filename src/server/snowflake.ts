import * as snowflake from "snowflake-sdk";
import { SnowflakeError } from "snowflake-sdk";
import { Request, Response } from 'express';


const connectionConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT ?? '',
  username: process.env.SNOWFLAKE_USERNAME ?? '',
  password: process.env.SNOWFLAKE_PASSWORD ?? '',
  region: process.env.SNOWFLAKE_REGION ?? '',
  warehouse: process.env.SNOWFLAKE_WAREHOUSE ?? '',
  database: process.env.SNOWFLAKE_DATABASE ?? '',
  schema: process.env.SNOWFLAKE_SCHEMA ?? '',
};

class SnowflakeConnection {
  private connection: snowflake.Connection;

  constructor() {
    this.connection = this.createConnection();
  }

  private createConnection(): snowflake.Connection {
    const newConnection = snowflake.createConnection(connectionConfig);
    newConnection.connect((err) => {
      if (err) {
        console.error("Unable to connect to Snowflake:", err);
      } else {
        console.log("Successfully connected to Snowflake.");
      }
    });
    return newConnection;
  }

  public async execute(sqlText: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.execute({
        sqlText,
        complete: (err, stmt, rows) => {
          if (err) {
            const snowflakeError = err as SnowflakeError;
            console.error('querySnowflake error:', err);
            // 407001: a connection was never established.
            // 407002: a connection was disconnected.
            if (snowflakeError.code === 407002 || snowflakeError.code === 407001) {
              console.error('Connection terminated. Attempting to reconnect...');
              this.connection = this.createConnection();
              this.execute(sqlText)
                .then(resolve)
                .catch(reject);
            } else {
              reject(err);
            }
          } else {
            resolve(rows);
          }
        },
      });
    });
  }
}

const snowflakeConnection = new SnowflakeConnection();

export async function querySnowflake(sqlText: string): Promise<any> {
  return snowflakeConnection.execute(sqlText);
}

export async function snowflakeHandler(req: Request, res: Response): Promise<void> {
  const { sql } = req.body;
  console.log("snowflakeHandler.request");

  if (sql) {
    try {
      console.log("snowflakeHandler query:", sql);
      const result = await querySnowflake(sql as string);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
      console.log("snowflakeHandler query result:", result);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: (error as Error).message ?? 'An unknown error occurred' }));
      console.error("snowflakeHandler error:", error);
    }
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing sql statement' }));
    console.warn("snowflakeHandler empty request");
  }
}

export default snowflakeHandler;
