import { Request, Response } from "express";
import {
  IExperience,
  IRecentMatches,
  IUser,
} from "../interfaces/InfoInterface";

import db from "../models/index";
import { getRecentMatchList } from "../utils/matches";
import { getPlayerLevelByList } from "../utils/playerLevel";

const getRecentMatches = async (req: Request, res: Response) => {
  const { limit } = req.query;

  if (!Number(limit)) return res.status(401).send("Parâmetro inválido.");

  try {
    const matchList: IRecentMatches[] = await getRecentMatchList(Number(limit));

    res.status(200).send(matchList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
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

    res.status(200).send(userListWithLevel);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

export { getPlayerRanking, getRecentMatches };
