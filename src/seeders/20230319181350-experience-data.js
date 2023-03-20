"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Experience",
      [
        {
          level: 1,
          experience_accumulated: 0,
        },
        {
          level: 2,
          experience_accumulated: 50,
        },
        {
          level: 3,
          experience_accumulated: 150,
        },
        {
          level: 4,
          experience_accumulated: 350,
        },
        {
          level: 5,
          experience_accumulated: 750,
        },
        {
          level: 6,
          experience_accumulated: 1550,
        },
        {
          level: 7,
          experience_accumulated: 3150,
        },
        {
          level: 8,
          experience_accumulated: 6350,
        },
        {
          level: 9,
          experience_accumulated: 12750,
        },
        {
          level: 10,
          experience_accumulated: 25550,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Experience", null, {});
  },
};
