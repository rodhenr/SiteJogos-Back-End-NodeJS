import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Config_MatchResult extends Model {
  }

  Config_MatchResult.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      matchResult: {
        defaultValue: null,
        type: DataTypes.STRING(20),
      },
    },
    {
      sequelize,
      tableName: "Config_MatchResult",
      modelName: "Config_MatchResult",
      timestamps: false,
    }
  );

  return Config_MatchResult;
};
