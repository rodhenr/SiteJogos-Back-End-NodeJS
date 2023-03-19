import { findAllUsers } from "../controllers/AuthController";
import { Router } from "express";

const authRoutes = Router();

authRoutes.route("/get").get(findAllUsers);

export default authRoutes;
