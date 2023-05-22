declare module 'snowflake-sdk' {
  export interface Connection {
    connect: (callback: (err: any, conn: Connection) => void) => void;
    execute: (options: {
      sqlText: string;
      complete: (err: any, stmt: any, rows: any[]) => void;
    }) => void;
  }

  export function createConnection(options: {
    account: string;
    username: string;
    password: string;
    region: string;
    warehouse: string;
    database: string;
    schema: string;
  }): Connection;

  export interface SnowflakeError {
    code: number;
    isFatal: boolean;
  }
}
