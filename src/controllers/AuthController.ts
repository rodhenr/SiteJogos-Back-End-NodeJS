import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../models/index";

const handleRegister = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(401).send("Informações inválidas.");

  try {
    const isUserRegistered = await db.User.findOne({
      where: { name: username },
    });

    if (isUserRegistered) return res.status(401).send("Usuário já registrado");

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.User.create({
      name: username,
      password: hashedPassword,
    });

    res.status(200).send("Usuário registrado com sucesso!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Aconteceu um erro no seu registro...");
  }
};

const handleLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(401).send("As informações de login não são válidas.");

  try {
    if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
      throw Error("Server error");

    const userData = await db.User.findOne({
      where: { name: username },
      raw: true,
    });

    if (!userData) return res.status(401).send("Login inválido.");

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) return res.status(401).send("Login inválido.");

    const userDataName = userData.name;

    const accessToken = jwt.sign({ userDataName }, process.env.jwt_secret, {
      expiresIn: 100 * 60,
    });
    const refreshToken = jwt.sign(
      { username: userDataName },
      process.env.jwt_secret_refresh,
      {
        expiresIn: 15 * 60,
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, username: userDataName });
  } catch (err) {
    console.log(err);
    res.status(500).send("Ops... Ocorreu um erro no servidor.");
  }
};

const handleRefreshToken = (req: Request, res: Response) => {
  if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
    throw Error("Server error");

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  jwt.verify(
    refreshToken,
    process.env.jwt_secret_refresh,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(406).json("Token expirado.");
      } else {
        const { username } = decoded;

        if (!username)
          return res.status(401).send("Token com dados inválidos.");

        const accessToken = jwt.sign({ username }, process.env.jwt_secret!, {
          expiresIn: 100 * 60,
        });

        const refreshToken = jwt.sign(
          { username },
          process.env.jwt_secret_refresh!,
          {
            expiresIn: 15 * 60,
          }
        );

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken, username: username });
      }
    }
  );
};

export { handleLogin, handleRegister, handleRefreshToken };
