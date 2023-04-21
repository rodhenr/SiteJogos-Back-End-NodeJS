"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_JokenpoResults",
      [
        {
          userChoiceID: 1,
          cpuChoiceID: 1,
          userResultID: 3,
        },
        {
          userChoiceID: 2,
          cpuChoiceID: 2,
          userResultID: 3,
        },
        {
          userChoiceID: 3,
          cpuChoiceID: 3,
          userResultID: 3,
        },
        {
          userChoiceID: 1,
          cpuChoiceID: 2,
          userResultID: 1,
        },
        {
          userChoiceID: 2,
          cpuChoiceID: 1,
          userResultID: 2,
        },
        {
          userChoiceID: 1,
          cpuChoiceID: 3,
          userResultID: 2,
        },
        {
          userChoiceID: 3,
          cpuChoiceID: 1,
          userResultID: 1,
        },
        {
          userChoiceID: 2,
          cpuChoiceID: 3,
          userResultID: 1,
        },
        {
          userChoiceID: 3,
          cpuChoiceID: 2,
          userResultID: 2,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Config_JokenpoResults", null, {});
  },
};
