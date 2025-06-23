import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || "b_drive",
  process.env.DB_USER || "root", 
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "mysql",
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

export default db;
