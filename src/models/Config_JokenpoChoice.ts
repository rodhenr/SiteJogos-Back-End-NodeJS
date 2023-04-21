import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Config_JokenpoChoice extends Model {}

  Config_JokenpoChoice.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      choice: {
        defaultValue: null,
        type: DataTypes.STRING(20),
      },
    },
    {
      sequelize,
      tableName: "Config_JokenpoChoice",
      modelName: "Config_JokenpoChoice",
      timestamps: false,
    }
  );

  return Config_JokenpoChoice;
};
