import {
  IExperience,
  IRecentMatches,
  IUserMatches,
  IUser,
  IUserSafe,
  IGameStats,
  IUserFriends,
} from "../interfaces/InfoInterface";

import db from "../models";
import { createErrorObject } from "./games/generalService";

export const findOneUser = async (user: string) => {
  const data: IUser | null = await db.User.findOne({
    where: { user },
    raw: true,
  });

  return data;
};

export const findOneUserByIDSafe = async (userID: number) => {
  const data: IUserSafe | null = await db.User.findOne({
    attributes: { exclude: ["password"] },
    raw: true,
    where: { id: userID },
  });

  return data;
};

export const findAllUsers = async () => {
  const data: IUserSafe[] = await db.User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });

  return data;
};

export const findUserLevel = (
  experienceList: IExperience[],
  userInfo: IUserSafe
) => {
  const level = experienceList
    .filter((lvl) => {
      return Number(lvl.experience_accumulated) <= Number(userInfo.experience);
    })
    .at(-1);

  if (!level)
    throw createErrorObject("Tabela de experiência não encontrada.", 500);

  const nextLevel = experienceList
    .filter((lvl) => {
      return lvl.level === Number(level.level) + 1;
    })
    .at(-1);

  if (!nextLevel)
    throw createErrorObject(
      "Não foi possível determinar os níveis de experiência.",
      500
    );

  return {
    avatar: userInfo.avatar,
    id: userInfo.id,
    name: userInfo.name,
    experience: userInfo.experience,
    level: Number(level.level),
    maxExperience: nextLevel.experience_accumulated,
  };
};

export const usersDataOrdered = async (userInfo: IUserSafe[]) => {
  const experienceList: IExperience[] = await db.Experience.findAll({
    raw: true,
  });

  const dataWithLevel = userInfo.map((user) => {
    return findUserLevel(experienceList, user);
  });

  const dataOrderedByLevel = dataWithLevel.sort((a, b) => {
    if (a.level !== b.level) {
      return b.level - a.level;
    } else {
      return b.experience - a.experience;
    }
  });

  const dataOrderedByPosition = dataOrderedByLevel.map((user, index) => {
    const { experience, ...userData } = user;

    return { ...userData, position: index + 1 };
  });

  return dataOrderedByPosition;
};

export const findUserLevelWithRanking = async (id: number) => {
  const usersData: IUserSafe[] = await db.User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });
  const dataOrdered = await usersDataOrdered(usersData);

  const userData = dataOrdered.filter((user) => user.id === id);

  if (!userData || userData.length === 0)
    throw createErrorObject("Dados não encontrados para o usuário.", 401);

  return userData[0];
};

export const findUserStatistics = async (id: number) => {
  const userMatches: IUserMatches[] = await db.Match.findAll({
    attributes: {
      exclude: ["userID", "gameID"],
    },
    include: [
      { model: db.Game, attributes: ["name"] },
      {
        model: db.MatchProcessingHistory,
        include: [{ model: db.Config_MatchResult }],
      },
    ],
    raw: true,
    where: { userID: id },
  });

  const statistics: IGameStats[] = [];

  if (userMatches.length > 0) {
    for (const match of userMatches) {
      const gameIndex = statistics.findIndex((statistic) => {
        return statistic.game === match["Game.name"];
      });

      const isDraw =
        match["MatchProcessingHistory.Config_MatchResult.matchResult"] ===
        "draw";
      const isWin =
        match["MatchProcessingHistory.Config_MatchResult.matchResult"] ===
        "win";
      const isLose =
        match["MatchProcessingHistory.Config_MatchResult.matchResult"] ===
        "lose";

      if (gameIndex === -1) {
        statistics.push({
          game: match["Game.name"],
          wins: Number(isWin),
          loses: Number(isLose),
          draws: Number(isDraw),
        });
      } else {
        if (isDraw) {
          statistics[gameIndex].draws++;
        } else if (isWin) {
          statistics[gameIndex].wins++;
        } else {
          statistics[gameIndex].loses++;
        }
      }
    }
  }

  return statistics;
};

export const findUserFriends = async (id: number) => {
  const data: IUserFriends[] = await db.Friend.findAll({
    include: [
      {
        attributes: ["avatar", "id", "name"],
        model: db.User,
      },
    ],
    raw: true,
    where: { userID1: id },
  });

  return data;
};

export const getUserBasicInfo = async (user: string) => {
  const userData = await findOneUser(user);

  if (!userData) throw createErrorObject("Usuário não encontrado.", 401);

  const experienceList: IExperience[] = await db.Experience.findAll({
    raw: true,
  });

  return findUserLevel(experienceList, userData);
};

export const getUserCompleteInfo = async (user: string) => {
  const userData = await findOneUser(user);

  if (!userData) throw createErrorObject("Usuário não encontrado.", 401);

  const userDataWithLevelAndRanking = await findUserLevelWithRanking(
    userData.id
  );

  const userStatistics = await findUserStatistics(userData.id);

  const userFriends = await findUserFriends(userData.id);

  return {
    ...userDataWithLevelAndRanking,
    friends: userFriends,
    statistics: userStatistics,
    experience: userData.experience,
  };
};
