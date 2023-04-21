import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Match_TicTacToe extends Model {
    static associate(models: any) {
      Match_TicTacToe.belongsTo(models.Match, { foreignKey: "matchID" });
    }
  }

  Match_TicTacToe.init(
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
      isUserMove: {
        allowNull: false,
        defaultValue: true,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_1: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_2: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_3: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_4: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_5: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_6: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_7: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_8: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
      isUserCell_9: {
        allowNull: true,
        defaultValue: null,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "Matches_TicTacToe",
      modelName: "Match_TicTacToe",
      timestamps: false,
    }
  );

  return Match_TicTacToe;
};
