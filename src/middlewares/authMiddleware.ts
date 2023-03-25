import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";

const verifyJWT = (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Nenhum token encontrado" });

    if (!authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Nenhum token encontrado" });

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.jwt_secret!, (err: any, decoded: any) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Falha ao autenticar o token.", err });

      req.user = decoded.user;
      next();
    });
  } catch (err) {
    throw new Error("Can't authenticate JWT Token");
  }
};

export { verifyJWT };
