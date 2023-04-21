"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Config_JokenpoChoices", {
      id: {
        allowNull: false,
        autoIncrement: { type: Sequelize.INTEGER, initialValue: 1 },
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      choice: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Config_JokenpoChoices");
  },
};
