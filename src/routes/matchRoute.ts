import { Router } from "express";

import { getMatches, getUserMatches } from "../controllers/MatchController";

import { verifyJWT } from "../middlewares/authMiddleware";

const matchesRoutes = Router();

matchesRoutes.route("/api/match").get(getMatches);
matchesRoutes.route("/api/match/user").get(verifyJWT, getUserMatches);

export default matchesRoutes;