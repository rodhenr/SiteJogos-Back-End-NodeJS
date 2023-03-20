import {
  getPlayerRanking,
  getRecentMatches,
} from "../controllers/InfoController";
import { Router } from "express";

const infoRoutes = Router();

infoRoutes.route("/api/info/ranking").get(getPlayerRanking);
infoRoutes.route("/api/info/recent").get(getRecentMatches);

export default infoRoutes;
