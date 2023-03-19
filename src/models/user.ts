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
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      avatar: {
        allowNull: false,
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
