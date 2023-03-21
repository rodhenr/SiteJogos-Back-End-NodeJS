import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Game extends Model {}

  Game.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      win_points: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      draw_points: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      lose_points: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Games",
      modelName: "Game",
      timestamps: false,
    }
  );

  return Game;
};
