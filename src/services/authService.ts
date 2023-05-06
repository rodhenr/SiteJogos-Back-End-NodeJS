import jwt from "jsonwebtoken";
import { IJWTDecoded } from "../interfaces/interfaces";

import db from "../models";
import { createErrorObject } from "./games/generalService";

export const isUserRegistered = async (user: string) => {
  const userData = await db.User.findOne({
    where: { user },
  });

  return !!userData;
};

export const createNewUser = async (
  name: string,
  user: string,
  password: string
) => {
  await db.User.create({
    name,
    user,
    password,
  });

  return;
};

export const createTokens = (name: string, user: string) => {
  if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
    throw createErrorObject("Configurações do servidor não encontradas.", 500);

  const accessToken = jwt.sign({ name, user }, process.env.jwt_secret, {
    expiresIn: 100 * 60,
  });

  const refreshToken = jwt.sign(
    { name, user },
    process.env.jwt_secret_refresh,
    {
      expiresIn: 15 * 60,
    }
  );

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken: any) => {
  if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
    throw createErrorObject("Configurações do servidor não encontradas.", 500);

  return jwt.verify(refreshToken, process.env.jwt_secret_refresh);
};
