import { handleLogin, handleRegister } from "../controllers/AuthController";
import { Router } from "express";

const authRoutes = Router();

authRoutes.route("/auth/login").post(handleLogin);
authRoutes.route("/auth/register").post(handleRegister);

export default authRoutes;
