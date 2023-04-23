import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Match_Uno extends Model {
    static associate(models: any) {
      Match_Uno.belongsTo(models.Match, { foreignKey: "matchID" });
      Match_Uno.belongsTo(models.Config_UnoCard, { foreignKey: "lastCardID" });
    }
  }

  Match_Uno.init(
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
      isClockwise: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
      nextPlayer: {
        allowNull: false,
        type: DataTypes.STRING(10),
      },
      remainingCards: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      remainingPlayers: {
        allowNull: false,
        defaultValue: '["user", "cpu1", "cpu2", "cpu3"]',
        type: DataTypes.STRING(100),
      },
      gameHistory: {
        defaultValue: null,
        type: DataTypes.STRING(2000),
      },
      lastCardID: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      currentColor: {
        defaultValue: null,
        type: DataTypes.STRING(10),
      },
      userCards: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      cpu1Cards: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      cpu2Cards: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      cpu3Cards: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
    },
    {
      sequelize,
      tableName: "Matches_Uno",
      modelName: "Match_Uno",
      timestamps: false,
    }
  );

  return Match_Uno;
};
