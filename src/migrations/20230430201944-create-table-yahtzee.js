"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Matches_Yahtzee", {
      id: {
        allowNull: false,
        autoIncrement: true,
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
      remainingMoves: {
        allowNull: false,
        defaultValue: 2,
        type: Sequelize.INTEGER,
      },
      currentDices: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      ruleSum_all: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_one: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_two: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_three: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_four: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_five: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSum_six: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSame_three: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleSame_four: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      rule_yahtzee: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleRow_four: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      ruleRow_five: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Matches_Yahtzee");
  },
};
