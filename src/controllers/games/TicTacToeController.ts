import { Request, Response } from "express";
import { startNewGame } from "../../services/games/generalService";
import db from "../../models";
import { playerMovement } from "../../services/games/TicTacToeService";
import { IUser } from "../../interfaces/InfoInterface";

export const newTicTacToeGame = async (req: Request | any, res: Response) => {
  const { gameID } = req.body;
  const date = new Date();

  if (!gameID)
    return res
      .status(400)
      .json({ message: "Parâmetro(s) de entrada inválido(s)." });

  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo)
      return res.status(401).json({ message: "Usuário não encontrado." });

    const newGame = await startNewGame(userInfo.id, Number(gameID), date);

    return res.status(200).json({ matchID: newGame.id });
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

export const playerMove = async (req: Request | any, res: Response) => {
  const { matchID, squarePosition } = req.body;

  if (
    !matchID ||
    !squarePosition ||
    !["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(squarePosition)
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

    if (!user) res.status(401).json({ message: "Usuário inválido." });

    const doPlayerMovement = await playerMovement(
      Number(matchID),
      Number(squarePosition)
    );

    return res.status(200).json({ message: doPlayerMovement.message });
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