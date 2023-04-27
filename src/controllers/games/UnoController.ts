import { Request, Response } from "express";
import db from "../../models";

import { IMatchUno, IUser } from "../../interfaces/InfoInterface";
import {
  buyCardAction,
  getInitialData,
  cpuAction,
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

    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID: newGame.id },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1CardsLength: JSON.parse(data.cpu1Cards).length,
      cpu2CardsLength: JSON.parse(data.cpu2Cards).length,
      cpu3CardsLength: JSON.parse(data.cpu3Cards).length,
      isClockwise: data.isClockwise,
      lastCard: data.lastCard,
      nextPlayer: data.nextPlayer,
      remainingCardsLength: JSON.parse(data.remainingCards).length,
      remainingPlayers: JSON.parse(data.remainingPlayers),
      userCards: JSON.parse(data.userCards),
      matchID: newGame.id,
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

    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1CardsLength: JSON.parse(data.cpu1Cards).length,
      cpu2CardsLength: JSON.parse(data.cpu2Cards).length,
      cpu3CardsLength: JSON.parse(data.cpu3Cards).length,
      isClockwise: data.isClockwise,
      lastCard: data.lastCard,
      nextPlayer: data.nextPlayer,
      remainingCardsLength: JSON.parse(data.remainingCards).length,
      remainingPlayers: JSON.parse(data.remainingPlayers),
      userCards: JSON.parse(data.userCards),
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

    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1CardsLength: JSON.parse(data.cpu1Cards).length,
      cpu2CardsLength: JSON.parse(data.cpu2Cards).length,
      cpu3CardsLength: JSON.parse(data.cpu3Cards).length,
      isClockwise: data.isClockwise,
      lastCard: data.lastCard,
      nextPlayer: data.nextPlayer,
      remainingCardsLength: JSON.parse(data.remainingCards).length,
      remainingPlayers: JSON.parse(data.remainingPlayers),
      userCards: JSON.parse(data.userCards),
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

    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1CardsLength: JSON.parse(data.cpu1Cards).length,
      cpu2CardsLength: JSON.parse(data.cpu2Cards).length,
      cpu3CardsLength: JSON.parse(data.cpu3Cards).length,
      isClockwise: data.isClockwise,
      lastCard: data.lastCard,
      nextPlayer: data.nextPlayer,
      remainingCardsLength: JSON.parse(data.remainingCards).length,
      remainingPlayers: JSON.parse(data.remainingPlayers),
      userCards: JSON.parse(data.userCards),
    });
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

    //Prourar dados partidas AQUI
    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1CardsLength: data.cpu1Cards.length,
      cpu2CardsLength: data.cpu2Cards.length,
      cpu3CardsLength: data.cpu3Cards.length,
      isClockwise: data.isClockwise,
      lastCard: data.lastCard,
      nextPlayer: data.nextPlayer,
      remainingCardsLength: JSON.parse(data.remainingCards).length,
      remainingPlayers: JSON.parse(data.remainingPlayers),
      userCards: JSON.parse(data.userCards),
    });
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
