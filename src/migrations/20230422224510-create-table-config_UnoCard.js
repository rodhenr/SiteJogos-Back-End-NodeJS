"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Config_UnoCards", {
      id: {
        allowNull: false,
        autoIncrement: { type: Sequelize.INTEGER, initialValue: 1 },
        type: Sequelize.INTEGER,
      },
      card: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(20),
      },
      color: {
        defaultValue: null,
        type: Sequelize.STRING(10),
      },
      value: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      is_num: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_block: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_reverse: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_plusTwo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_plusFour: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      is_changeColor: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Config_UnoCards");
  },
};
