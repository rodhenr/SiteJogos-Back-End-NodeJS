import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class MatchProcessingHistory extends Model {
    static associate(models: any) {
      MatchProcessingHistory.hasOne(models.Match, { foreignKey: "id" });
      MatchProcessingHistory.hasOne(models.Config_MatchResult, {
        foreignKey: "id",
      });
    }
  }

  MatchProcessingHistory.init(
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
      matchResultID: {
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "MatchProcessingHistory",
      modelName: "MatchProcessingHistory",
      timestamps: false,
    }
  );

  return MatchProcessingHistory;
};
