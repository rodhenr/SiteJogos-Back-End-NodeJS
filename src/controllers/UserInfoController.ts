import { Request, Response } from "express";
import { IUser, IExperience } from "../interfaces/InfoInterface";
import db from "../models";

import { getPlayerMatchList } from "../utils/matches";
import { getUniquePlayerLevel } from "../utils/playerLevel";

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

export { getUserMatchesHistory, getUserBasicInfo };
