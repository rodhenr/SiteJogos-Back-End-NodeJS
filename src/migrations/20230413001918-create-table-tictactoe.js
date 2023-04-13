"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Match_TicTacToe", {
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
      isUserMove: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_1: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_2: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_3: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_4: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_5: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_6: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_7: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_8: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
      isUserCell_9: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Match_TicTacToe");
  },
};
