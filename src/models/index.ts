import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes } from "sequelize";
import { ISequelizeDB } from "../interfaces/InfoInterface";
import { conn } from "../config/conn";

type PartialDB = Partial<ISequelizeDB>;

const basename: string = path.basename(__filename);
const db: PartialDB = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".ts" &&
      file.indexOf(".test.ts") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(conn, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = conn;
db.Sequelize = Sequelize;

export default db;
