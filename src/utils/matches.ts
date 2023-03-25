import { IRecentMatches, IUser } from "../interfaces/InfoInterface";

import db from "../models";

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
