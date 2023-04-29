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
      isClockwise: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      nextPlayer: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      remainingCards: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      remainingPlayers: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      gameHistory: {
        defaultValue: null,
        type: Sequelize.STRING(2000),
      },
      lastCard: {
        defaultValue: null,
        references: {
          model: "Config_UnoCards",
          key: "card",
        },
        onDelete: "CASCADE",
        type: Sequelize.STRING(20),
      },
      currentColor: {
        defaultValue: null,
        type: Sequelize.STRING(10),
      },
      turn: {
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
