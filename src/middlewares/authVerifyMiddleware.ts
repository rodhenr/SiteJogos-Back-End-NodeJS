import { NextFunction, Request, Response } from "express";
import { isUserRegistered } from "../services/authService";

const verifyRegisterFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, name, password } = req.body;

  if (!user || !name || !password) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  if (user.length < 4 || !/^[a-zA-Z]+$/.test(user.trim())) {
    return res.status(400).json({
      message:
        "O usuário contém caracteres inválidos ou possui menos de 4 caracteres",
    });
  }

  if (name.length < 4 || !/^[a-zA-Z\s]+$/.test(name.trim())) {
    return res.status(400).json({ message: "Nome inválido" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  try {
    const userRegistered = await isUserRegistered(user);

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
