import { Request, Response } from "express";

import { getMatchesList, getUserMatchesList } from "../services/matchService";

const getMatches = async (req: Request, res: Response) => {
  const { limit } = req.query;

  if (!Number(limit))
    return res.status(401).json({ message: "O parâmetro enviado é inválido." });

  try {
    const matchList = await getMatchesList(Number(limit));

    res.status(200).json(matchList);
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

const getUserMatches = async (req: Request | any, res: Response) => {
  const { user } = req;
  const { limit } = req.query;

  if (!user || isNaN(limit))
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const matches = await getUserMatchesList(user, Number(limit));

    res.status(200).json(matches);
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

export { getMatches, getUserMatches };
