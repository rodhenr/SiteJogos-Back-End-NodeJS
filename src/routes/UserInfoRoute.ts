import { Router } from "express";

import {
  getUserMatchesHistory,
  getUserBasicInfo,
  getUserCompleteInfo,
} from "../controllers/UserInfoController";

import { verifyJWT } from "../middlewares/authMiddleware";

const userInfoRoutes = Router();

userInfoRoutes
  .route("/api/user/info/matches")
  .get(verifyJWT, getUserMatchesHistory);
userInfoRoutes.route("/api/user/info/basic").get(verifyJWT, getUserBasicInfo);
userInfoRoutes
  .route("/api/user/info/complete")
  .get(verifyJWT, getUserCompleteInfo);

export default userInfoRoutes;
