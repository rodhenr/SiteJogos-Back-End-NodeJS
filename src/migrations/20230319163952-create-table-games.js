"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Games", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, type: Sequelize.STRING },
      win_points: { allowNull: false, type: Sequelize.INTEGER },
      draw_points: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      lose_points: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Games");
  },
};
