"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_MatchResult",
      [
        {
          matchResult: "win",
        },
        {
          matchResult: "lose",
        },
        {
          matchResult: "draw",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Config_MatchResult", null, {});
  },
};
