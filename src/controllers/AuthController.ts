import { Request, Response } from "express";

import bcrypt from "bcrypt";

import {
  createNewUser,
  createTokens,
  isUserRegistered,
  verifyRefreshToken,
} from "../services/authService";

import { findOneUser } from "../services/userService";

const handleRegister = async (req: Request, res: Response) => {
  const { name, user, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await createNewUser(name, user, hashedPassword);

    res.status(200).json({ message: "Usuário registrado com sucesso!" });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, contate o suporte técnico.",
    });
  }
};

const handleLogin = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (!user || !password)
    return res
      .status(401)
      .json({ message: "As informações de login não são válidas" });

  try {
    const userData = await findOneUser(user);
    if (!userData) return res.status(401).json({ message: "Login inválido" });

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) return res.status(401).json({ message: "Login inválido" });

    const { accessToken, refreshToken } = createTokens(
      userData.name,
      userData.user
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, username: userData.name });
  } catch (err: any) {
    console.log(err);

    res.status(500).json({
      message: err?.message
        ? err.mesage
        : "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

const handleRefreshToken = (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res.status(401).json({ message: "Token não localizado." });

    const refreshTokenCookie = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    const decoded = verifyRefreshToken(refreshTokenCookie) as {
      user: string;
      name: string;
    };

    if (!decoded)
      return res
        .status(401)
        .json({ message: "Ocorreu um problema na verificação do token." });

    const { accessToken, refreshToken } = createTokens(
      decoded.name,
      decoded.user
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken, username: decoded.name });
  } catch (err) {
    res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

export { handleLogin, handleRegister, handleRefreshToken };
