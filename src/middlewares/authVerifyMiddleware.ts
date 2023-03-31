import { NextFunction, Request, Response } from "express";
import { isUserRegistered } from "../services/authService";

const verifyRegisterFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.user || !req.body.name || !req.body.password) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  if (req.body.user.length < 4) {
    return res.status(400).json({ message: "Usuário inválido" });
  }

  if (req.body.name.length < 4) {
    return res.status(400).json({ message: "Nome inválido" });
  }

  if (req.body.password.length < 8) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  try {
    const userRegistered = await isUserRegistered(req.body.user);

    if (userRegistered)
      return res.status(401).json({ message: "Usuário já registrado" });

    next();
  } catch (err) {
    return res.status(500).json({
      message:
        "Ocorreu um erro na sua requisição. Por favor, entre em contato com o suporte técnico.",
    });
  }
};

export { verifyRegisterFields };
