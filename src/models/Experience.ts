import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Experience extends Model {}

  Experience.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      level: { allowNull: false, type: DataTypes.SMALLINT },
      experience_accumulated: { allowNull: false, type: DataTypes.BIGINT },
    },
    {
      sequelize,
      tableName: "Experience",
      modelName: "Experience",
      timestamps: false,
    }
  );

  return Experience;
};
