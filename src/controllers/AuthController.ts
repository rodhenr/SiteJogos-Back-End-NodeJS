import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../models/index";

const handleRegister = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(401).send("Informações inválidas.");

  try {
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

const handleLogin = async (req: Request | any, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(401).send("As informações de login não são válidas.");

  try {
    if (!process.env.jwt_secret || !process.env.jwt_secret_refresh)
      throw Error("Server error");

    const userData = await db.User.findOne({
      name: username,
    });

    if (!userData) return res.status(401).send("Login inválido.");

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) return res.status(401).send("Login inválido.");

    const userDataName = userData.name;

    const accessToken = jwt.sign({ userDataName }, process.env.jwt_secret, {
      expiresIn: 100 * 60,
    });
    const refreshToken = jwt.sign(
      { userDataName },
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

export { handleLogin, handleRegister };
