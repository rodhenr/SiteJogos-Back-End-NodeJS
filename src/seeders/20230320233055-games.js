"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Games",
      [
        {
          name: "Uno",
          win_points: 50,
          draw_points: 0,
          lose_points: 10,
        },
        {
          name: "Yahtzee",
          win_points: 30,
          draw_points: 0,
          lose_points: 5,
        },
        {
          name: "JoKenPo",
          win_points: 2,
          draw_points: 0,
          lose_points: 0,
        },
        {
          name: "TicTacToe",
          win_points: 2,
          draw_points: 0,
          lose_points: 0,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Games", null, {});
  },
};
