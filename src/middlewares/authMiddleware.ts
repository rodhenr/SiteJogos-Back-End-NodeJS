import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { createErrorObject } from "../services/games/generalService";

const verifyJWT = (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Nenhum token encontrado" });

    if (!authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Nenhum token encontrado" });
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.jwt_secret!,
      (err: VerifyErrors | null, decoded: any) => {
        if (err)
          return res
            .status(403)
            .json({ message: "Falha ao autenticar o token.", err });

        req.user = decoded.user;
        next();
      }
    );
  } catch (err) {
    throw createErrorObject(
      "Ocorreu um problema na autenticação do token.",
      500
    );
  }
};

export { verifyJWT };
