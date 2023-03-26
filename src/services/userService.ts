import { IUser } from "../interfaces/InfoInterface";
import db from "../models";

export const findOneUser = async (user: string) => {
  const data: IUser | null = await db.User.findOne({
    where: { user },
    raw: true,
  });

  return data;
};
