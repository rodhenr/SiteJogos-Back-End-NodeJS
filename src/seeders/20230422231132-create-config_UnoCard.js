"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Config_UnoCards",
      [
        {
          card: "0Blue",
          color: "blue",
          value: 0,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "1Blue",
          color: "blue",
          value: 1,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "2Blue",
          color: "blue",
          value: 2,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "3Blue",
          color: "blue",
          value: 3,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "4Blue",
          color: "blue",
          value: 4,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "5Blue",
          color: "blue",
          value: 5,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "6Blue",
          color: "blue",
          value: 6,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "7Blue",
          color: "blue",
          value: 7,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "8Blue",
          color: "blue",
          value: 8,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "9Blue",
          color: "blue",
          value: 9,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "blockBlue",
          color: "blue",
          is_num: false,
          is_block: true,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "reverseBlue",
          color: "blue",
          is_num: false,
          is_block: false,
          is_reverse: true,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "plusTwoBlue",
          color: "blue",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: true,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "0Green",
          color: "green",
          value: 0,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "1Green",
          color: "green",
          value: 1,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "2Green",
          color: "green",
          value: 2,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "3Green",
          color: "green",
          value: 3,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "4Green",
          color: "green",
          value: 4,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "5Green",
          color: "green",
          value: 5,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "6Green",
          color: "green",
          value: 6,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "7Green",
          color: "green",
          value: 7,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "8Green",
          color: "green",
          value: 8,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "9Green",
          color: "green",
          value: 9,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "blockGreen",
          color: "green",
          is_num: false,
          is_block: true,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "reverseGreen",
          color: "green",
          is_num: false,
          is_block: false,
          is_reverse: true,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "plusTwoGreen",
          color: "green",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: true,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "0Yellow",
          color: "yellow",
          value: 0,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "1Yellow",
          color: "yellow",
          value: 1,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "2Yellow",
          color: "yellow",
          value: 2,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "3Yellow",
          color: "yellow",
          value: 3,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "4Yellow",
          color: "yellow",
          value: 4,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "5Yellow",
          color: "yellow",
          value: 5,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "6Yellow",
          color: "yellow",
          value: 6,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "7Yellow",
          color: "yellow",
          value: 7,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "8Yellow",
          color: "yellow",
          value: 8,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "9Yellow",
          color: "yellow",
          value: 9,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "blockYellow",
          color: "yellow",
          is_num: false,
          is_block: true,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "reverseYellow",
          color: "yellow",
          is_num: false,
          is_block: false,
          is_reverse: true,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "plusTwoYellow",
          color: "yellow",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: true,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "0Red",
          color: "red",
          value: 0,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "1Red",
          color: "red",
          value: 1,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "2Red",
          color: "red",
          value: 2,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "3Red",
          color: "red",
          value: 3,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "4Red",
          color: "red",
          value: 4,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "5Red",
          color: "red",
          value: 5,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "6Red",
          color: "red",
          value: 6,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "7Red",
          color: "red",
          value: 7,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "8Red",
          color: "red",
          value: 8,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "9Red",
          color: "red",
          value: 9,
          is_num: true,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "blockRed",
          color: "red",
          is_num: false,
          is_block: true,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "reverseRed",
          color: "red",
          is_num: false,
          is_block: false,
          is_reverse: true,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "plusTwoRed",
          color: "red",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: true,
          is_plusFour: false,
          is_changeColor: false,
        },
        {
          card: "plusFour1",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: true,
          is_changeColor: false,
        },
        {
          card: "plusFour2",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: true,
          is_changeColor: false,
        },
        {
          card: "plusFour3",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: true,
          is_changeColor: false,
        },
        {
          card: "plusFour4",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: true,
          is_changeColor: false,
        },
        {
          card: "changeColor1",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: true,
        },
        {
          card: "changeColor2",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: true,
        },
        {
          card: "changeColor3",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: true,
        },
        {
          card: "changeColor4",
          is_num: false,
          is_block: false,
          is_reverse: false,
          is_plusTwo: false,
          is_plusFour: false,
          is_changeColor: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DBCC CHECKIDENT('Config_UnoCards', RESEED, 0)"
    );
    await queryInterface.bulkDelete("Config_UnoCards", null, {});
  },
};