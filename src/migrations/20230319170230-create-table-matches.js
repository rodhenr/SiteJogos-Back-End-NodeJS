"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Matches", {
      id: {
        allowNull: false,
        autoIncrement: { type: Sequelize.INTEGER, initialValue: 1 },
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userID: {
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      gameID: {
        allowNull: false,
        references: {
          model: "Games",
          key: "id",
        },
        onDelete: "CASCADE",
        type: Sequelize.INTEGER,
      },
      date: { allowNull: false, type: Sequelize.DATE },
      matchProcessingHistoryID: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Matches");
  },
};
