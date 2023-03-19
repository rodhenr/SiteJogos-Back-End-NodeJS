import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Message extends Model {
    static associate(models: any) {
      Message.belongsTo(models.User, { foreignKey: "fromUserID" });
      Message.belongsTo(models.User, { foreignKey: "toUserID" });
    }
  }
  Message.init(
    {
      fromUserID: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      toUserID: { allowNull: false, primaryKey: true, type: DataTypes.INTEGER },
      message: { allowNull: false, type: DataTypes.STRING },
      date: { allowNull: false, type: DataTypes.DATE },
    },
    {
      sequelize,
      tableName: "Messages",
      modelName: "Message",
      timestamps: false,
    }
  );

  return Message;
};
