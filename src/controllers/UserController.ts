import { Request, Response } from "express";

import { getUserBasicInfo, getUserCompleteInfo } from "../services/userService";

const getBasicInfo = async (req: Request | any, res: Response) => {
  const { user } = req;

  if (!user)
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const userBasicData = await getUserBasicInfo(user);

    return res.status(200).json(userBasicData);
  } catch (err) {
    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

const getCompleteInfo = async (req: Request | any, res: Response) => {
  const { user } = req;

  if (!user)
    return res.status(401).json({
      message:
        "Ocorreu um erro na sua requisição. Não foi possível determinar o usuário.",
    });

  try {
    const userCompleteInfo = await getUserCompleteInfo(user);

    return res.status(200).json(userCompleteInfo);
  } catch (err) {
    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

export { getBasicInfo, getCompleteInfo };
