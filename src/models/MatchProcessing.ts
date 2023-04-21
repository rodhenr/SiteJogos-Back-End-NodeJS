import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class MatchProcessing extends Model {
    static associate(models: any) {
      MatchProcessing.belongsTo(models.Config_Result, {
        foreignKey: "resultID",
        targetKey: "id",
      });
      MatchProcessing.hasOne(models.Match, { foreignKey: "id" });
      MatchProcessing.belongsTo(models.Match, {
        foreignKey: "matchID",
        targetKey: "id",
      });
    }
  }

  MatchProcessing.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      matchID: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      date: { allowNull: false, type: DataTypes.DATEONLY },
      resultID: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "MatchesProcessing",
      modelName: "MatchProcessing",
      timestamps: false,
    }
  );

  return MatchProcessing;
};
