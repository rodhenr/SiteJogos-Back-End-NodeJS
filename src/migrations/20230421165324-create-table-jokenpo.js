"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Match_Jokenpo", {
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
        allowNull: false,
        references: {
          model: "Config_JokenpoChoice",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      cpuChoiceID: {
        allowNull: false,
        references: {
          model: "Config_JokenpoChoice",
          key: "ID",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Match_Jokenpo");
  },
};
