import { Op } from "sequelize";
import {
  IUserMatches,
  IRecentMatches,
  IUser,
} from "../interfaces/InfoInterface";

import db from "../models";
import { createErrorObject } from "./games/generalService";

export const getMatchesList = async (limit: number) => {
  const matchList: IRecentMatches[] = await db.Match.findAll({
    attributes: {
      exclude: ["gameID"],
    },
    order: [["id", "DESC"]],
    include: [
      { model: db.User, attributes: ["name"] },
      { model: db.Game, attributes: ["name"] },
      {
        model: db.MatchProcessingHistory,
        include: [
          {
            model: db.Config_MatchResult,
          },
        ],
      },
    ],
    where: { matchProcessingHistoryID: { [Op.ne]: null } },
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

  if (!userData) throw createErrorObject("Usuário não encontrado.", 401);

  const matchList: IUserMatches[] = await db.Match.findAll({
    attributes: {
      exclude: ["userID", "gameID"],
    },
    order: [["id", "DESC"]],
    include: [
      { model: db.Game, attributes: ["name"] },
      {
        model: db.MatchProcessingHistory,
        include: [{ model: db.Config_MatchResult }],
      },
    ],
    limit: Number(limit),
    raw: true,
    where: {
      userID: userData.id,
      matchProcessingHistoryID: { [Op.ne]: null },
    },
  });

  return matchList;
};
