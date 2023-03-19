import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model {}

  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(100),
      },
      password: { allowNull: false, type: DataTypes.STRING(100) },
      experience: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT,
      },
      avatar: {
        allowNull: false,
        defaultValue: "",
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "Users",
      modelName: "User",
      timestamps: false,
    }
  );

  return User;
};
