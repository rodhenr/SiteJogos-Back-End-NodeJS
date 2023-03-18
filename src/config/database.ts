import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("db_user", "user", "123456", {
  host: "localhost",
  dialect: "mssql",
});
