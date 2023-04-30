import { Request, Response } from "express";

import db from "../../models";

import { getYahtzeeInicialData } from "../../services/games/YahtzeeService";
import { startNewGame } from "../../services/games/generalService";

import { IUser, IMatchYahtzee } from "../../interfaces/InfoInterface";

export const newYahtzeeGame = async (req: Request | any, res: Response) => {
  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    const newGame = await startNewGame(userInfo.id, 2, new Date());

    const data: IMatchYahtzee = await getYahtzeeInicialData(newGame.id);

    return res.status(200).json(data);
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

