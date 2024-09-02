import dotenv from "dotenv";
import { DataSource } from "typeorm";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  throw new Error(
    "Missing necessary environment variables for database configuration."
  );
}

const isProduction = process.env.NODE_ENV === "production";

import { Users } from "../entities/user.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432", 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    isProduction
      ? "server/dist/entities/**/*.js"
      : "server/src/entities/**/*.ts",
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
});
