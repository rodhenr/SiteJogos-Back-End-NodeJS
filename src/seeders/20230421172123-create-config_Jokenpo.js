"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_JokenpoChoice",
      [
        {
          choice: "rock",
        },
        {
          choice: "scissor",
        },
        {
          choice: "paper",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Config_JokenpoChoice", null, {});
  },
};
