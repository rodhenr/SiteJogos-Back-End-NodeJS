import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Config_UnoCard extends Model {}

  Config_UnoCard.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      card: {
        allowNull: false,
        type: DataTypes.STRING(20),
      },
      color: {
        defaultValue: null,
        type: DataTypes.STRING(10),
      },
      value: {
        defaultValue: null,
        type: DataTypes.INTEGER,
      },
      is_num: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_block: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_reverse: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_plusTwo: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_plusFour: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      is_changeColor: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "Config_UnoCards",
      modelName: "Config_UnoCard",
      timestamps: false,
    }
  );

  return Config_UnoCard;
};
