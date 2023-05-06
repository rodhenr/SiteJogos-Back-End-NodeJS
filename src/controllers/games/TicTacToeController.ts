import { Request, Response } from "express";
import db from "../../models";
import {
  cpuMovement,
  playerMovement,
} from "../../services/games/TicTacToeService";
import { IUser } from "../../interfaces/interfaces";

export const playerMove = async (req: Request | any, res: Response) => {
  const { matchID, squarePosition } = req.body;
  if (
    !matchID ||
    !squarePosition ||
    ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(squarePosition)
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

    const dataAfterPlayerMovement = await playerMovement(
      Number(matchID),
      Number(squarePosition)
    );

    return res.status(200).json({ ...dataAfterPlayerMovement });
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

export const cpuMove = async (req: Request | any, res: Response) => {
  const { matchID } = req.body;

  if (!matchID)
    return res.status(400).json({ message: "Parâmetro de entrada inválido." });

  try {
    const user: string = req.user;

    const userInfo: IUser = await db.User.findOne({
      where: { user: user },
      raw: true,
    });

    if (!userInfo) res.status(401).json({ message: "Usuário inválido." });

    const dataAfterCPUMovement = await cpuMovement(
      Number(matchID),
      userInfo.id
    );

    return res.status(200).json({ ...dataAfterCPUMovement });
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
