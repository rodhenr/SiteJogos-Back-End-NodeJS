"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Matches", {
      fields: ["matchProcessingID"],
      name: "FK_Matches_MatchesProcessing",
      references: {
        table: "MatchesProcessing",
        field: "id",
      },
      type: "foreign key",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Matches",
      "FK_Matches_MatchesProcessing"
    );
  },
};
