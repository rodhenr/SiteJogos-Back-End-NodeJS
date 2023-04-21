"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_JokenpoResults",
      [
        {
          playerChoiceID: 1,
          cpuChoiceID: 1,
          playerResultID: 3,
        },
        {
          playerChoiceID: 2,
          cpuChoiceID: 2,
          playerResultID: 3,
        },
        {
          playerChoiceID: 3,
          cpuChoiceID: 3,
          playerResultID: 3,
        },
        {
          playerChoiceID: 1,
          cpuChoiceID: 2,
          playerResultID: 1,
        },
        {
          playerChoiceID: 2,
          cpuChoiceID: 1,
          playerResultID: 2,
        },
        {
          playerChoiceID: 1,
          cpuChoiceID: 3,
          playerResultID: 2,
        },
        {
          playerChoiceID: 3,
          cpuChoiceID: 1,
          playerResultID: 1,
        },
        {
          playerChoiceID: 2,
          cpuChoiceID: 3,
          playerResultID: 1,
        },
        {
          playerChoiceID: 3,
          cpuChoiceID: 2,
          playerResultID: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Config_JokenpoResults", null, {});
  },
};
