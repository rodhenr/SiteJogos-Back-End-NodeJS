"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "JohnDoe",
          user: "JohnDoe",
          password: "123456",
          experience: 156,
        },
        {
          name: "Maria",
          user: "Maria",
          password: "123456",
          experience: 1920,
        },
        {
          name: "João",
          user: "Joao",
          password: "123456",
          experience: 1450,
        },
        {
          name: "Pedro",
          user: "Pedro",
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
