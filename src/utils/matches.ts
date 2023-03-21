import { IRecentMatches } from "../interfaces/InfoInterface";

import db from "../models";

export const getPlayerMatchList = async (userID: string, limit: number) => {
  const matchList: IRecentMatches[] = await db.Match.findAll({
    limit: Number(limit),
    where: {
      userID: userID,
    },
    raw: true,
    include: [{ model: db.Game, attributes: ["name"] }],
    attributes: {
      exclude: ["userID", "gameID"],
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
