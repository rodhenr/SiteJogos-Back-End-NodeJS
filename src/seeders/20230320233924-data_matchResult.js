"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_Results",
      [
        {
          result: "win",
        },
        {
          result: "lose",
        },
        {
          result: "draw",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DBCC CHECKIDENT('Config_Results', RESEED, 0)"
    );
    await queryInterface.bulkDelete("Config_Results", null, {});
  },
};
