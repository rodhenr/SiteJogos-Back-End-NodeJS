import { IRecentMatches, IUser } from "../interfaces/InfoInterface";

import db from "../models";

type GameStats = {
  game: string;
  wins: number;
  loses: number;
};

export const getPlayerMatchList = async (user: string, limit: number) => {
  const userData: IUser = await db.User.findOne({
    where: { user },
    raw: true,
  });

  if (!userData) {
    throw Error("Usuário não localizado.");
  }

  const matchList: IRecentMatches[] = await db.Match.findAll({
    limit: Number(limit),
    where: {
      userID: userData.id,
    },
    raw: true,
    include: [{ model: db.Game, attributes: ["name"] }],
    attributes: {
      exclude: ["userID", "gameID", "isProcessed"],
    },
  });

  return matchList;
};

export const getRecentMatchList = async (limit: number) => {
  const matchList: IRecentMatches[] = await db.Match.findAll({
    limit: Number(limit),
    raw: true,
    include: [
      { model: db.User, attributes: ["name"] },
      { model: db.Game, attributes: ["name"] },
    ],
    attributes: {
      exclude: ["userID", "gameID"],
    },
  });

  return matchList;
};

export const getPlayerStatisticsByGame = async (user: IUser) => {
  const userMatches: IRecentMatches[] = await db.Match.findAll({
    include: [{ attributes: ["name"], model: db.Game }],
    raw: true,
    where: { userID: user.id },
  });

  const statistics: GameStats[] = [];

  if (userMatches.length > 0) {
    for (const match of userMatches) {
      console.log(match);
      const gameIndex = statistics.findIndex((statistic) => {
        statistic.game === match["Game.name"];
      });

      if (gameIndex === -1) {
        statistics.push({
          game: match["Game.name"],
          wins: Number(match.is_win),
          loses: Number(!match.is_win),
        });
      } else {
        if (match.is_win) {
          statistics[gameIndex].wins++;
        } else {
          statistics[gameIndex].loses++;
        }
      }
    }
  }

  return statistics;
};
