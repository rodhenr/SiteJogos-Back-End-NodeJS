import { Request, Response } from "express";
import { IUser, IExperience } from "../interfaces/InfoInterface";
import db from "../models";

import {
  getPlayerMatchList,
  getPlayerStatisticsByGame,
} from "../utils/matches";
import {
  getPlayerLevelByList,
  getUniquePlayerLevel,
} from "../utils/playerLevel";

const getUserBasicInfo = async (req: Request | any, res: Response) => {
  const { user } = req;

  if (!user)
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const userData: IUser = await db.User.findOne({
      attributes: { exclude: ["password"] },
      raw: true,
      where: { user },
    });

    const experienceList: IExperience[] = await db.Experience.findAll({
      raw: true,
    });

    const userDataWithLevel = getUniquePlayerLevel(experienceList, userData);

    return res.status(200).json({ ...userDataWithLevel });
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

const getUserCompleteInfo = async (req: Request | any, res: Response) => {
  const { user } = req;

  if (!user)
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const userData: IUser = await db.User.findOne({
      attributes: { exclude: ["password"] },
      raw: true,
      where: { user },
    });

    if (!userData)
      return res.status(401).json({
        message: "Usuario não encontrado",
      });

    const userList: IUser[] = await db.User.findAll({
      raw: true,
      attributes: ["id", "name", "experience"],
    });

    const experienceList: IExperience[] = await db.Experience.findAll({
      raw: true,
    });

    const userListWithLevel = await getPlayerLevelByList(userList);

    const userListOrdered = userListWithLevel.sort((a, b) => {
      if (a.level !== b.level) {
        return b.level - a.level;
      } else {
        return b.experience - a.experience;
      }
    });

    const userByPosition = userListOrdered.map((user, index) => {
      const { experience, ...userData } = user;

      return { ...userData, position: index + 1 };
    });

    const userRanking = userByPosition.filter(
      (user) => user.id === userData.id
    );

    if (!userRanking) throw Error("Ranking não localizado");

    const userInfoWithLevel = getUniquePlayerLevel(experienceList, userData);

    const userFriends = await db.Friend.findAll({
      include: [
        {
          attributes: ["avatar", "id", "name"],
          model: db.User,
        },
      ],
      raw: true,
      where: { userID1: userData.id },
    });

    const userGameStatistics = await getPlayerStatisticsByGame(userData);

    return res.status(200).json({
      avatar: userData.avatar,
      experience: userData.experience,
      friends: userFriends,
      id: userData.id,
      level: userInfoWithLevel.level,
      maxExperience: userInfoWithLevel.maxExperience,
      name: userData.name,
      ranking: userRanking[0].position,
      statistics: userGameStatistics,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

const getUserMatchesHistory = async (req: Request | any, res: Response) => {
  const { user } = req;
  const { limit } = req.query;

  if (!user || !Number(limit))
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const matchesHistory = await getPlayerMatchList(user, Number(limit));

    res.status(200).send(matchesHistory);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

export { getUserMatchesHistory, getUserBasicInfo, getUserCompleteInfo };
