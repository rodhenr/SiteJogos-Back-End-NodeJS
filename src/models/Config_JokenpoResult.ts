import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Config_JokenpoResult extends Model {
    static associate(models: any) {
      Config_JokenpoResult.belongsTo(models.Config_JokenpoChoice, {
        foreignKey: "playerChoiceID",
        targetKey: "id",
      });
      Config_JokenpoResult.belongsTo(models.Config_JokenpoChoice, {
        foreignKey: "cpuChoiceID",
        targetKey: "id",
      });
      Config_JokenpoResult.belongsTo(models.Config_Result, {
        foreignKey: "playerResultID",
        targetKey: "id",
      });
    }
  }

  Config_JokenpoResult.init(
    {
      playerChoiceID: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cpuChoiceID: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      playerResultID: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: "Config_JokenpoResults",
      modelName: "Config_JokenpoResult",
      timestamps: false,
    }
  );

  return Config_JokenpoResult;
};
