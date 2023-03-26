import { getRankingList, getUserInfo } from "../controllers/RankingController";
import { Router } from "express";

const rankingRoutes = Router();

rankingRoutes.route("/api/ranking").get(getRankingList);
rankingRoutes.route("/api/ranking/user").get(getUserInfo);

export default rankingRoutes;
