import { IMatch, IUser } from "../interfaces/InfoInterface";

import db from "../models";

export const getMatchesList = async (limit: number) => {
  const matchList: IMatch[] = await db.Match.findAll({
    attributes: {
      exclude: ["gameID", "isProcessed"],
    },
    include: [
      { model: db.User, attributes: ["name"] },
      { model: db.Game, attributes: ["name"] },
    ],
    limit: Number(limit),
    raw: true,
  });

  return matchList;
};

export const getUserMatchesList = async (user: string, limit: number) => {
  const userData: IUser = await db.User.findOne({
    raw: true,
    where: { user },
  });

  if (!userData) {
    throw Error("Usuário não encontrado.");
  }

  const matchList: IMatch[] = await db.Match.findAll({
    attributes: {
      exclude: ["userID", "gameID", "isProcessed"],
    },
    include: [{ model: db.Game, attributes: ["name"] }],
    limit: Number(limit),
    raw: true,
    where: {
      userID: userData.id,
    },
  });

  return matchList;
};
