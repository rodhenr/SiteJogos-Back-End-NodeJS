import { Router } from "express";

import {
  handleLogin,
  handleRegister,
  handleRefreshToken,
} from "../controllers/AuthController";

const authRoutes = Router();

authRoutes.route("/api/auth/login").post(handleLogin);
authRoutes.route("/api/auth/register").post(handleRegister);
authRoutes.route("/api/auth/refresh").post(handleRefreshToken);

export default authRoutes;
