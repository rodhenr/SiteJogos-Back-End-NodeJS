import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Match extends Model {
    static associate(models: any) {
      Match.belongsTo(models.User, { foreignKey: "userID" });
      Match.belongsTo(models.Game, { foreignKey: "gameID" });
      Match.hasOne(models.Match_TicTacToe, { foreignKey: "matchID" });
    }
  }

  Match.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userID: { allowNull: false, type: DataTypes.INTEGER },
      gameID: { allowNull: false, type: DataTypes.INTEGER },
      date: { allowNull: false, type: DataTypes.DATEONLY },
      is_win: { type: DataTypes.BOOLEAN, defaultValue: null },
      is_processed: { type: DataTypes.BOOLEAN, defaultValue: null },
    },
    {
      sequelize,
      tableName: "Matches",
      modelName: "Match",
      timestamps: false,
    }
  );

  return Match;
};
