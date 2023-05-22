// This method won't work in stateless services
import { querySnowflakeAPI } from '../services/snowflake-service';

const SnowflakeSchemaSQL = `SELECT table_name, LISTAGG(column_name, ', ') WITHIN GROUP (ORDER BY column_name) AS columns FROM ${process.env.SNOWFLAKE_DATABASE}.INFORMATION_SCHEMA.COLUMNS WHERE table_schema = '${process.env.SNOWFLAKE_SCHEMA}' GROUP BY table_name;`;

class SchemaService {
  private static instance: SchemaService;
  private cachedSchema: any;

  private constructor() { }

  public static getInstance(): SchemaService {
    if (!SchemaService.instance) {
      SchemaService.instance = new SchemaService();
    }

    return SchemaService.instance;
  }

  public async getSchema(type: string = ""): Promise<any> {
    if (!this.cachedSchema) {
      console.log("Caching schema: ", SnowflakeSchemaSQL);
      const response = await querySnowflakeAPI(SnowflakeSchemaSQL);
      this.cachedSchema = response;
      if (!this.cachedSchema) {
        console.error("Failed to cache schema.");
      }
      else {
        console.log("Cached schema: ", this.cachedSchema);
      }
    }
    else {
      console.log("Cache existed!");
    }

    return this.cachedSchema;
  }
}

export default SchemaService;
