import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Config_Result extends Model {}

  Config_Result.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      result: {
        defaultValue: null,
        type: DataTypes.STRING(10),
      },
    },
    {
      sequelize,
      tableName: "Config_Results",
      modelName: "Config_Result",
      timestamps: false,
    }
  );

  return Config_Result;
};
