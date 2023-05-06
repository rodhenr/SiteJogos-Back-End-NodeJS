import { Request, Response } from "express";
import db from "../../models";

import { IUnoMatchState, IUser } from "../../interfaces/interfaces";
import {
  buyCardAction,
  checkGameOver,
  cpuAction,
  getUnoMatchState,
  playerAction,
  skipTurnAction,
} from "../../services/games/UnoService";
import { startNewGame } from "../../services/games/generalService";

export const newUnoGame = async (req: Request | any, res: Response) => {
  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    const newGame = await startNewGame(userInfo.id, 1, new Date());

    const data: IUnoMatchState = await getUnoMatchState(newGame.id);

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

export const playerTurn = async (req: Request | any, res: Response) => {
  const { matchID, card, color } = req.body;

  if (!matchID || !card)
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

    await playerAction(matchID, card, color);
    await checkGameOver(matchID);

    const data: IUnoMatchState = await getUnoMatchState(matchID);

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

export const cpuTurn = async (req: Request | any, res: Response) => {
  const { matchID } = req.body;

  if (!matchID)
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

    await cpuAction(matchID);
    await checkGameOver(matchID);

    const data: IUnoMatchState = await getUnoMatchState(matchID);

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

export const buyCard = async (req: Request | any, res: Response) => {
  const { matchID, player } = req.body;

  if (!matchID || !player)
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

    await buyCardAction(matchID, player);
    await checkGameOver(matchID);

    const data: IUnoMatchState = await getUnoMatchState(matchID);

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

export const skipTurn = async (req: Request | any, res: Response) => {
  const { matchID, player } = req.body;

  if (!matchID || !player)
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

    await skipTurnAction(matchID, player);
    await checkGameOver(matchID);

    const data: IUnoMatchState = await getUnoMatchState(matchID);

    return res.status(200).json({
      gameResult: data.gameResult,
      isGameOver: data.isGameOver,
      nextPlayer: data.nextPlayer,
      turn: data.turn,
    });
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
