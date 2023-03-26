import { Router } from "express";

import { getBasicInfo, getCompleteInfo } from "../controllers/UserController";

import { verifyJWT } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.route("/api/user/basic").get(verifyJWT, getBasicInfo);
userRoutes.route("/api/user/complete").get(verifyJWT, getCompleteInfo);

export default userRoutes;
