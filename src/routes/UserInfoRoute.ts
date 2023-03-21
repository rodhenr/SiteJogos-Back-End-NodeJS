import { getUserMatchesHistory } from "../controllers/UserInfoController";

import { Router } from "express";

const userInfoRoutes = Router();

userInfoRoutes.route("/api/user/match/history").get(getUserMatchesHistory);

export default userInfoRoutes;
