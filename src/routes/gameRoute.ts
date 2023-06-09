import { Router } from "express";

import { verifyJWT } from "../middlewares/authMiddleware";

import { newMatch } from "../controllers/games/GamesController";

import { cpuMove, playerMove } from "../controllers/games/TicTacToeController";
import { playerChoice } from "../controllers/games/JokenpoController";
import {
  buyCard,
  cpuTurn,
  newUnoGame,
  playerTurn,
  skipTurn,
} from "../controllers/games/UnoController";
import {
  calculateRulePoints,
  newYahtzeeGame,
  rollDice,
} from "../controllers/games/YahtzeeController";

const gameRoute = Router();

gameRoute.route("/api/games/start").post(verifyJWT, newMatch);

gameRoute.route("/api/games/tictactoe/player/move").post(verifyJWT, playerMove);
gameRoute.route("/api/games/tictactoe/cpu/move").post(verifyJWT, cpuMove);

gameRoute
  .route("/api/games/jokenpo/player/choice")
  .post(verifyJWT, playerChoice);

gameRoute.route("/api/games/uno/new").post(verifyJWT, newUnoGame);
gameRoute.route("/api/games/uno/player/move").post(verifyJWT, playerTurn);
gameRoute.route("/api/games/uno/buy").post(verifyJWT, buyCard);
gameRoute.route("/api/games/uno/skip").post(verifyJWT, skipTurn);
gameRoute.route("/api/games/uno/cpu/move").post(verifyJWT, cpuTurn);

gameRoute.route("/api/games/yahtzee/new").post(verifyJWT, newYahtzeeGame);
gameRoute.route("/api/games/yahtzee/roll").post(verifyJWT, rollDice);
gameRoute.route("/api/games/yahtzee/rule").post(verifyJWT, calculateRulePoints);

export default gameRoute;
