import { getMatchesList } from "./matchService";

import {
  IGameListByPlayer,
  IGamePlayerInfo,
  IGames,
  IMatchesGroup,
} from "../interfaces/InfoInterface";
import db from "../models";
import sequelize from "sequelize";

export const getRecordsList = async () => {
  const matchesList: IMatchesGroup[] = await db.Match.findAll({
    attributes: [
      "User.id",
      "User.name",
      "Game.id",
      [sequelize.fn("COUNT", sequelize.col("is_win")), "totalWins"],
    ],
    include: [
      {
        model: db.User,
        attributes: ["id", "name"],
      },
      {
        model: db.Game,
        attributes: ["id", "name"],
      },
    ],
    where: {
      is_win: true,
    },
    group: ["User.name", "Game.id", "Game.name", "User.id"],
    raw: true,
  });

  const gamesList: IGames = {};

  if (matchesList.length > 0) {
    for (const match of matchesList) {
      const gameIndex = Object.keys(gamesList).findIndex((game) => {
        return game === match["Game.name"];
      });

      const gameName = match["Game.name"];
      const userName = match["User.name"];
      const userID = match["User.id"];
      const totalWins = match.totalWins;

      if (gameIndex === -1) {
        gamesList[gameName] = [{ gameName, userName, userID, totalWins }];
      } else {
        gamesList[gameName].push({ gameName, userName, userID, totalWins });
      }
    }
  }

  const listSortedByWin: IGameListByPlayer = {};

  for (let game in gamesList) {
    const sortedList = gamesList[game].sort(
      (a, b) => b.totalWins - a.totalWins
    );

    listSortedByWin[game] = sortedList;
  }

  const limitedDataByFiveRecords: IGameListByPlayer = {};

  for (let game in gamesList) {
    limitedDataByFiveRecords[game] = listSortedByWin[game].slice(0, 5);
  }

  return limitedDataByFiveRecords;
};
