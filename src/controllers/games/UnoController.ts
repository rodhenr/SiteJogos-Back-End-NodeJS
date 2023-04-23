import { Request, Response } from "express";
import db, { sequelize } from "../../models";

import {
  IConfigUnoCards,
  IMatchUno,
  IUser,
} from "../../interfaces/InfoInterface";
import {
  buyCardAction,
  cpuAction,
  playerAction,
} from "../../services/games/UnoService";

export const playerTurn = async (req: Request | any, res: Response) => {
  const { matchID, card, color = null } = req.body;

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

    const data = await playerAction(matchID, card, color);

    return res.status(200).json({ ...data });
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

    const data = await cpuAction(matchID, player);

    return res.status(200).json(data);
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

    //Prourar dados partidas AQUI
    const data: IMatchUno = await db.Match_Uno.findOne({
      where: { matchID },
      raw: true,
    });

    const lastCard: IConfigUnoCards = await db.Config_UnoCard.findOne({
      where: { id: data.lastCardID },
      raw: true,
    });

    return res.status(200).json({
      color: data.currentColor,
      cpu1Cards: JSON.parse(data.cpu1Cards),
      cpu2Cards: JSON.parse(data.cpu2Cards),
      cpu3Cards: JSON.parse(data.cpu3Cards),
      isClockwise: data.isClockwise,
      lastCard: lastCard?.card,
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
