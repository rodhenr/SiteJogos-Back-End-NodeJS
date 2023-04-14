import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";
import {
  newTicTacToeGame,
  playerMove,
} from "../controllers/games/TicTacToeController";

const gameRoute = Router();

gameRoute.route("/api/games/tictactoe/start").post(verifyJWT, newTicTacToeGame);
gameRoute.route("/api/games/tictactoe/move").post(verifyJWT, playerMove);

export default gameRoute;
