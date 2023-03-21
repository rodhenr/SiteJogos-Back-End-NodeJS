import { Request, Response } from "express";

import { getPlayerMatchList } from "../utils/matches";

const getUserMatchesHistory = async (req: Request, res: Response) => {
  const { userID, limit } = req.body;

  if (!Number(userID) || !Number(limit))
    return res.status(401).send("ID de usuário é inválido.");

  try {
    const matchesHistory = await getPlayerMatchList(userID, Number(limit));

    res.status(200).send(matchesHistory);
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

export { getUserMatchesHistory };
