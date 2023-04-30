import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Match_Yahtzee extends Model {
    static associate(models: any) {
      Match_Yahtzee.belongsTo(models.Match, { foreignKey: "matchID" });
    }
  }

  Match_Yahtzee.init(
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
      remainingMoves: {
        allowNull: false,
        defaultValue: 2,
        type: DataTypes.INTEGER,
      },
      currentDices: { allowNull: false, type: DataTypes.STRING(50) },
      ruleSum_all: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_one: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_two: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_three: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_four: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_five: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSum_six: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSame_three: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleSame_four: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      rule_yahtzee: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleRow_four: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      ruleRow_five: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Matches_Yahtzee",
      modelName: "Match_Yahtzee",
      timestamps: false,
    }
  );

  return Match_Yahtzee;
};
