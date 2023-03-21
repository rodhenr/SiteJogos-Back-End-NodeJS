"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Matches",
      [
        {
          userID: 1,
          gameID: 1,
          date: "2023-03-19 12:00:00",
          is_win: true,
          is_processed: true,
        },
        {
          userID: 2,
          gameID: 3,
          date: "2023-03-19 13:00:00",
          is_win: true,
          is_processed: true,
        },
        {
          userID: 3,
          gameID: 2,
          date: "2023-03-19 14:00:00",
          is_win: false,
          is_processed: true,
        },
        {
          userID: 4,
          gameID: 4,
          date: "2023-03-19 15:00:00",
          is_win: false,
          is_processed: true,
        },
        {
          userID: 4,
          gameID: 2,
          date: "2023-03-19 16:00:00",
          is_win: false,
          is_processed: true,
        },
        {
          userID: 3,
          gameID: 2,
          date: "2023-03-19 17:00:00",
          is_win: true,
          is_processed: true,
        },
        {
          userID: 2,
          gameID: 1,
          date: "2023-03-19 18:00:00",
          is_win: true,
          is_processed: true,
        },
        {
          userID: 2,
          gameID: 1,
          date: "2023-03-19 19:00:00",
          is_win: false,
          is_processed: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Matches", null, {});
  },
};
