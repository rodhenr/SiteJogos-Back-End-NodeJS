import { Sequelize } from "sequelize";
require("dotenv").config();
const tedious = require("tedious");

export const conn: Sequelize = new Sequelize(
  "db_games_app",
  process.env.bd_user!,
  process.env.bd_password,
  {
    host: process.env.bd_host,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: true,
      },
    },
    logging: false,
  }
);
