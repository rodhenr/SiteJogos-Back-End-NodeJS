import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware";

import { newMatch } from "../controllers/games/GamesController";

import { cpuMove, playerMove } from "../controllers/games/TicTacToeController";
import { playerChoice } from "../controllers/games/JokenpoController";

const gameRoute = Router();

gameRoute.route("/api/games/tictactoe/start").post(verifyJWT, newMatch);
gameRoute.route("/api/games/tictactoe/player/move").post(verifyJWT, playerMove);
gameRoute.route("/api/games/tictactoe/cpu/move").post(verifyJWT, cpuMove);

gameRoute.route("/api/games/jokenpo/start").post(verifyJWT, newMatch);
gameRoute
  .route("/api/games/jokenpo/player/choice")
  .post(verifyJWT, playerChoice);

export default gameRoute;
