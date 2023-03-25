import { Request, Response } from "express";
import {
  IExperience,
  IRecentMatches,
  IUser,
} from "../interfaces/InfoInterface";

import db from "../models/index";
import { getRecentMatchList } from "../utils/matches";
import {
  getPlayerLevelByList,
  getUniquePlayerLevel,
} from "../utils/playerLevel";

const getRecentMatches = async (req: Request, res: Response) => {
  const { limit } = req.query;

  if (!Number(limit)) return res.status(401).send("Parâmetro inválido.");

  try {
    const matchList: IRecentMatches[] = await getRecentMatchList(Number(limit));

    res.status(200).send(matchList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro na sua requisição...");
  }
};

const getPlayerRanking = async (req: Request, res: Response) => {
  const { limit } = req.query;

  if (!Number(limit)) return res.status(400).send("Parâmetro inválido.");

  try {
    const userList: IUser[] = await db.User.findAll({
      limit: Number(limit),
      raw: true,
      attributes: ["id", "name", "experience"],
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

    res.status(200).send(userByPosition);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro na sua requisição...");
  }
};

const getUserInfoFromRanking = async (req: Request, res: Response) => {
  const { userID } = req.query;

  if (!userID) return res.status(400).send("Parâmetros inválidos.");

  try {
    const userInfo = await db.User.findOne({
      where: { id: userID },
      raw: true,
    });

    if (!userInfo) return res.status(400).send("Usuário não encontrado.");

    const experienceList: IExperience[] = await db.Experience.findAll({
      raw: true,
    });

    const userList: IUser[] = await db.User.findAll({
      raw: true,
      attributes: ["id", "name", "experience"],
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
      (user) => user.id === Number(userID)
    );

    const userInfoWithLevel = getUniquePlayerLevel(experienceList, userInfo);

    return res.status(200).send({
      ...userInfoWithLevel,
      avatar: userInfo.avatar,
      ranking: userRanking.length > 0 ? userRanking[0].position : 0,
      statistics: [],
    });
  } catch (err) {
    res.status(500).send("Aconteceu um erro na sua requisição...");
  }
};

export { getPlayerRanking, getRecentMatches, getUserInfoFromRanking };
