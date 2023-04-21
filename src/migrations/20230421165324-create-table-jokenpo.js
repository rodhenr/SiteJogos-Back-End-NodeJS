"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Matches_Jokenpo", {
      id: {
        allowNull: false,
        autoIncrement: { type: Sequelize.INTEGER, initialValue: 1 },
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      matchID: {
        allowNull: false,
        references: {
          model: "Matches",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      userChoiceID: {
        defaultValue: null,
        references: {
          model: "Config_JokenpoChoices",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      cpuChoiceID: {
        defaultValue: null,
        references: {
          model: "Config_JokenpoChoices",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Matches_Jokenpo");
  },
};
