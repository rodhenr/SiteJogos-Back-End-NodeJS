import { Request, Response } from "express";

import db from "../../models";

import { IUser } from "../../interfaces/InfoInterface";

import { handlePlayerChoice } from "../../services/games/JokenpoService";

export const playerMove = async (req: Request | any, res: Response) => {
  const { matchID, playerChoice } = req.body;
  if (
    !matchID ||
    !playerChoice ||
    !["paper", "scissor", "rock"].includes(playerChoice)
  )
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

    const gameData = await handlePlayerChoice(Number(matchID), playerChoice);

    return res.status(200).json();
  } catch (err: any) {
    console.log(err);
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
