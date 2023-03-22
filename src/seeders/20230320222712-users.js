"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "JohnDoe",
          password: "123456",
          experience: 156,
        },
        {
          name: "Maria",
          password: "123456",
          experience: 1920,
        },
        {
          name: "João",
          password: "123456",
          experience: 1450,
        },
        {
          name: "Pedro",
          password: "123456",
          experience: 3700,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
