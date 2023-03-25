import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../models/index";

const handleRegister = async (req: Request, res: Response) => {
  const { name, user, password } = req.body;

  if (!name || !password)
    return res.status(400).json({ message: "Informações inválidas" });

  try {
    const isUserRegistered = await db.User.findOne({
      where: { user },
    });

    if (isUserRegistered)
      return res.status(401).json({ message: "Usuário já registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.User.create({
      name,
      user,
      password: hashedPassword,
    });

    res.status(200).json("Usuário registrado com sucesso!");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ status: 500, message: "Aconteceu um erro no seu registro..." });
  }
};

const handleLogin = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (!user || !password)
    return res.status(401).send("As informações de login não são válidas");

  try {
    if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
      throw Error("Server error");

    const userData = await db.User.findOne({
      where: { user },
      raw: true,
    });

    if (!userData) return res.status(401).send("Login inválido");

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) return res.status(401).send("Login inválido");

    const { name: usernameToken, user: userToken } = userData;

    const accessToken = jwt.sign(
      { name: usernameToken, user: userToken },
      process.env.jwt_secret,
      {
        expiresIn: 100 * 60,
      }
    );
    const refreshToken = jwt.sign(
      { name: usernameToken, user: userToken },
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

    res.status(200).json({ accessToken, username: usernameToken });
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
        const { user } = decoded;

        if (!user) return res.status(401).send("Token com dados inválidos.");

        const accessToken = jwt.sign({ user }, process.env.jwt_secret!, {
          expiresIn: 100 * 60,
        });

        const refreshToken = jwt.sign(
          { user },
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

        return res.json({ accessToken, user: user });
      }
    }
  );
};

export { handleLogin, handleRegister, handleRefreshToken };
