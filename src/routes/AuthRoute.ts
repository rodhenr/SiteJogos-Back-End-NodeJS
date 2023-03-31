import { Router } from "express";

import {
  handleLogin,
  handleRegister,
  handleRefreshToken,
} from "../controllers/AuthController";

import { verifyRegisterFields } from "../middlewares/authVerifyMiddleware";

const authRoutes = Router();

authRoutes.route("/api/auth/login").post(handleLogin);
authRoutes
  .route("/api/auth/register")
  .post(verifyRegisterFields, handleRegister);
authRoutes.route("/api/auth/refresh").post(handleRefreshToken);

export default authRoutes;
