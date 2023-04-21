"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MatchesProcessing", {
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
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      date: { allowNull: false, type: Sequelize.DATEONLY },
      resultID: {
        defaultValue: null,
        references: {
          model: "Config_Results",
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MatchesProcessing");
  },
};
