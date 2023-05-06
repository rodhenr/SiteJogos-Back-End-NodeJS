import { Request, Response } from "express";

import db from "../../models";

import { IUser } from "../../interfaces/interfaces";

import { handlePlayerChoice } from "../../services/games/JokenpoService";

export const playerChoice = async (req: Request | any, res: Response) => {
  const { matchID, choice } = req.body;
  if (!matchID || !choice || !["paper", "scissors", "rock"].includes(choice))
    return res
      .status(400)
      .json({ message: "Parâmetro(s) de entrada inválido(s)." });

  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    const result = await handlePlayerChoice(Number(matchID), choice);

    return res.status(200).json({ ...result });
  } catch (err: any) {
    if (err?.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }
    return res.status(500).json({
      message: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
    });
  }
};
