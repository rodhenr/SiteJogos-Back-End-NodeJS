import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";
import {
  cpuMove,
  newTicTacToeGame,
  playerMove,
} from "../controllers/games/TicTacToeController";

const gameRoute = Router();

gameRoute.route("/api/games/tictactoe/start").post(verifyJWT, newTicTacToeGame);
gameRoute.route("/api/games/tictactoe/player/move").post(verifyJWT, playerMove);
gameRoute.route("/api/games/tictactoe/cpu/move").post(verifyJWT, cpuMove);

export default gameRoute;
