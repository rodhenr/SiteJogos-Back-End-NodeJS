import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Friend extends Model {
    static associate(models: any) {
      Friend.belongsTo(models.User, { foreignKey: "userID1" });
      Friend.belongsTo(models.User, { foreignKey: "userID2" });
    }
  }

  Friend.init(
    {
      userID1: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userID2: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: { allowNull: false, type: DataTypes.INTEGER },
    },
    {
      sequelize,
      tableName: "Friends",
      modelName: "Friend",
      timestamps: false,
    }
  );

  return Friend;
};
