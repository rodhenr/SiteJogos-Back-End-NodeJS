import {
  getPlayerRanking,
  getRecentMatches,
} from "../controllers/GeneralInfoController";
import { Router } from "express";

const generalInfoRoutes = Router();

generalInfoRoutes.route("/api/info/ranking").get(getPlayerRanking);
generalInfoRoutes.route("/api/info/recent").get(getRecentMatches);

export default generalInfoRoutes;