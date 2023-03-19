import { Request, Response } from "express";
import db from "../models/index";

export const findAllUsers = async (req: Request | any, res: Response) => {
  try {
    const teste = await db.User.findAll();

    res.status(200).send(teste);
  } catch (err) {
    console.log(err);
  }
};
