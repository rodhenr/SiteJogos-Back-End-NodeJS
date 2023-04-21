"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_JokenpoChoices",
      [
        {
          choice: "paper",
        },
        {
          choice: "rock",
        },
        {
          choice: "scissors",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Config_JokenpoChoices", null, {});
  },
};
