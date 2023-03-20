import { Request, Response } from "express";
import db from "../models/index";

const getUserMatchesHistory = async (req: Request, res: Response) => {
  const { userID } = req.body;

  try {
    const userMatches = db.Match.findAll({ where: { userID: userID } });

    res.status(200).send(userMatches);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

export { getUserMatchesHistory };
