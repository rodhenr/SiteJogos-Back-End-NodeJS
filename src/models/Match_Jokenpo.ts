import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Match_Jokenpo extends Model {
    static associate(models: any) {
      Match_Jokenpo.belongsTo(models.Match, { foreignKey: "matchID" });
      Match_Jokenpo.belongsTo(models.Config_JokenpoChoice, {
        foreignKey: "userChoiceID",
        targetKey: "id",
      });
      Match_Jokenpo.belongsTo(models.Config_JokenpoChoice, {
        foreignKey: "cpuChoiceID",
        targetKey: "id",
      });
    }
  }

  Match_Jokenpo.init(
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
      userChoiceID: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      cpuChoiceID: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Matches_Jokenpo",
      modelName: "Match_Jokenpo",
      timestamps: false,
    }
  );

  return Match_Jokenpo;
};
