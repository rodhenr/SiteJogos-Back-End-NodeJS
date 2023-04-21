import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { ISequelizeDB } from "../interfaces/InfoInterface";

type PartialDB = Partial<ISequelizeDB>;

const basename: string = path.basename(__filename);
const env: string = process.env.NODE_ENV || "development";
const config: any = require(__dirname + "/../config/sequelize.js")[env];
const db: PartialDB = {};

export let sequelize: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

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
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
