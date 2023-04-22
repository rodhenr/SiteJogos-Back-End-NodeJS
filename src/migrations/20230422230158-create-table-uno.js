"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Matches_Uno", {
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
      gameOrder: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      nextPlayer: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      remainingCards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      gameHistory: {
        defaultValue: null,
        type: Sequelize.STRING(2000),
      },
      lastCard: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      userCards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      cpu1Cards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      cpu2Cards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      cpu3Cards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Matches_Uno");
  },
};