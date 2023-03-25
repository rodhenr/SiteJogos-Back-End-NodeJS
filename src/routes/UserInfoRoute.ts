import { Router } from "express";

import {
  getUserMatchesHistory,
  getUserBasicInfo,
} from "../controllers/UserInfoController";

import { verifyJWT } from "../middlewares/authMiddleware";

const userInfoRoutes = Router();

userInfoRoutes
  .route("/api/user/info/matches")
  .get(verifyJWT, getUserMatchesHistory);
userInfoRoutes.route("/api/user/info/basic").get(verifyJWT, getUserBasicInfo);

export default userInfoRoutes;
