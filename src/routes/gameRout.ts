import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware";
import { newTicTacToeGame } from "../controllers/games/TicTacToeController";

const gameRoute = Router();

gameRoute.route("/api/games/tictactoe/start").post(verifyJWT, newTicTacToeGame);

export default gameRoute;
