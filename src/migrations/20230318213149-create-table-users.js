"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      experience: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.BIGINT,
      },
      avatar: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
