import { Request, Response } from "express";

import {
  findAllUsers,
  findOneUserByIDSafe,
  findUserLevelWithRanking,
  findUserStatistics,
  usersDataOrdered,
} from "../services/userService";

const getRankingList = async (req: Request, res: Response) => {
  const { limit } = req.query;

  if (!Number(limit))
    return res.status(401).json({ message: "Parâmetro de entrada inválido." });

  try {
    const usersData = await findAllUsers();

    const dataOrdered = await usersDataOrdered(usersData);

    res.status(200).json(dataOrdered.slice(0, Number(limit)));
  } catch (err: any) {
    if (err?.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    res.status(500).json({ message: "Aconteceu um erro na sua requisição..." });
  }
};

const getUserInfo = async (req: Request, res: Response) => {
  const { userID } = req.query;

  if (!Number(userID))
    return res.status(401).json({ message: "Parâmetro de entrada inválido." });

  try {
    const userData = await findOneUserByIDSafe(Number(userID));

    if (!userData)
      return res.status(400).json({ message: "Usuário não encontrado." });

    const userDataWithLevelRanking = await findUserLevelWithRanking(
      Number(userID)
    );

    const userStatistics = await findUserStatistics(Number(userID));

    return res.status(200).json({
      ...userDataWithLevelRanking,
      statistics: userStatistics,
    });
  } catch (err: any) {
    if (err?.statusCode) {
      return res.status(err.statusCode).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

export { getRankingList, getUserInfo };
