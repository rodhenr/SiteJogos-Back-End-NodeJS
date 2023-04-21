"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Config_JokenpoResults", {
      playerChoiceID: {
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Config_JokenpoChoices",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      cpuChoiceID: {
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Config_JokenpoChoices",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      playerResultID: {
        allowNull: false,
        references: {
          model: "Config_Results",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Config_JokenpoResults");
  },
};
