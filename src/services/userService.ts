import {
  IExperience,
  IMatchProfile,
  IUser,
  IUserSafe,
  IGameStats,
  IUserFriends,
} from "../interfaces/InfoInterface";

import db from "../models";

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
    throw Error(
      "Algo de errado aconteceu na sua requisição. Contate o suporte técnico."
    );

  const nextLevel = experienceList
    .filter((lvl) => {
      return lvl.level === Number(level.level) + 1;
    })
    .at(-1);

  if (!nextLevel)
    throw Error(
      "Algo de errado aconteceu na sua requisição. Contate o suporte técnico."
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
  const usersData = await db.User.findAll({
    attributes: { exclude: ["password"] },
    raw: true,
  });
  const dataOrdered = await usersDataOrdered(usersData);

  const userData = dataOrdered.filter((user) => user.id === id);

  if (!userData || userData.length === 0)
    throw Error("Dados não localizados para o usuário.");

  return userData[0];
};

export const findUserStatistics = async (id: number) => {
  const userMatches: IMatchProfile[] = await db.Match.findAll({
    attributes: {
      exclude: ["userID", "gameID", "isProcessed"],
    },
    include: [{ attributes: ["name"], model: db.Game }],
    raw: true,
    where: { userID: id },
  });

  const statistics: IGameStats[] = [];

  if (userMatches.length > 0) {
    for (const match of userMatches) {
      const gameIndex = statistics.findIndex((statistic) => {
        return statistic.game === match["Game.name"];
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

  if (!userData) throw Error("Usuário não encontrado.");

  const experienceList: IExperience[] = await db.Experience.findAll({
    raw: true,
  });

  return findUserLevel(experienceList, userData);
};

export const getUserCompleteInfo = async (user: string) => {
  const userData = await findOneUser(user);

  if (!userData) throw Error("Usuário não encontrado.");

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
