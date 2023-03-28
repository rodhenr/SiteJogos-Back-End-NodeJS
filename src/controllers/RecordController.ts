import { Request, Response } from "express";

import { getRecordsList } from "../services/recordService";

const getRecords = async (req: Request, res: Response) => {
  try {
    const records = await getRecordsList();

    return res.status(200).json(records);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

export { getRecords };
