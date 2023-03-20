import { Request, Response } from "express";
import { IExperience, IUser } from "../interfaces/InfoInterface";

import db from "../models/index";

const getRecentMatches = async (req: Request, res: Response) => {
  try {
    const recentMatches = await db.Match.findAll();

    const filteredMatches: any[] = [];

    res.status(200).send(filteredMatches);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

const getPlayerRanking = async (req: Request, res: Response) => {
  try {
    const userList: IUser[] = await db.User.findAll({
      raw: true,
      attributes: ["id", "name", "experience"],
    });

    const experience: IExperience[] = await db.Experience.findAll({
      raw: true,
    });

    const userListWithLevel = userList.map((user) => {
      const level = experience
        .filter((lvl) => {
          return Number(lvl.experience_accumulated) <= Number(user.experience);
        })
        .at(-1);

      if (!level)
        throw Error(
          "Algo de errado aconteceu na sua requisição. Contate o suporte técnico."
        );

      return { ...user, level: Number(level.level) };
    });

    res.status(200).send(userListWithLevel);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

export { getPlayerRanking, getRecentMatches };
