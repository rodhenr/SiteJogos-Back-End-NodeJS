require("dotenv").config();

module.exports = {
  development: {
    username: process.env.bd_user,
    password: process.env.bd_password,
    database: "db_games_app",
    host: process.env.bd_host,
    dialect: "mssql",
    logging: false,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mssql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mssql",
  },
};
