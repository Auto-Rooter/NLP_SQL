import { envConfig } from "@/config/env.config";
import { DataSource, DataSourceOptions } from "typeorm";

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: envConfig?.DB_HOST,
  port: envConfig?.DB_PORT,
  username: envConfig?.DB_USERNAME,
  password: envConfig?.DB_PASSWORD,
  database: envConfig?.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/**/*{.ts,.js}'],
  ssl: envConfig?.DB_SSL ? {
    rejectUnauthorized: false
  } : false
};

export const AppDataSource = new DataSource(databaseConfig);