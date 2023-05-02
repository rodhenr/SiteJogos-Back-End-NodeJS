import { Request, Response } from "express";

import db from "../../models";

import {
  getYahtzeeGameState,
  getYahtzeeInicialData,
  handleRollDice,
  useYahtzeeRule,
} from "../../services/games/YahtzeeService";
import { startNewGame } from "../../services/games/generalService";

import { IUser, IMatchYahtzeeState } from "../../interfaces/InfoInterface";

export const newYahtzeeGame = async (req: Request | any, res: Response) => {
  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    const newGame = await startNewGame(userInfo.id, 2, new Date());

    const data: IMatchYahtzeeState = await getYahtzeeInicialData(newGame.id);

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

export const rollDice = async (req: Request | any, res: Response) => {
  const { matchID, dices } = req.body;

  if (!matchID || !dices)
    return res.status(400).json({ message: "Parâmetro de entrada inválido." });

  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    await handleRollDice(matchID, dices);

    const data: IMatchYahtzeeState = await getYahtzeeGameState(matchID);

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

export const calculateRulePoints = async (
  req: Request | any,
  res: Response
) => {
  const { matchID, ruleName } = req.body;

  if (!matchID || !ruleName)
    return res.status(400).json({ message: "Parâmetro de entrada inválido." });

  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    await useYahtzeeRule(matchID, ruleName);

    const data: IMatchYahtzeeState = await getYahtzeeGameState(matchID);

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
