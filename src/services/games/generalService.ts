import { Transaction } from "sequelize";
import {
  IGame,
  IMatchProcessing,
  IConfig_Result,
  IMatch,
  IPossiblePoints,
  IUser,
} from "../../interfaces/InfoInterface";

import db from "../../models";
import { conn } from "../../config/conn";

export const startNewGame = async (
  userID: number,
  gameID: number,
  date: Date
) => {
  const gameInfo: IGame = await db.Game.findOne({
    where: { id: gameID },
    raw: true,
  });

  if (!gameInfo) throw createErrorObject("Este jogo não existe.", 400);

  const transaction = await conn.transaction();

  try {
    const newMatch: any = await db.Match.create(
      {
        userID,
        gameID,
        date,
      },
      { raw: true, transaction }
    );

    if (gameInfo.name.toLowerCase() === "uno") {
      await createUnoGame(transaction, newMatch.id);
    } else if (gameInfo.name.toLowerCase() === "yahtzee") {
      await createYahtzeeGame(transaction, newMatch.id);
    } else {
      await createGame(gameInfo.name, transaction, newMatch.id);
    }

    await transaction.commit();

    return newMatch.dataValues;
  } catch (err: any) {
    console.log(err);
    await transaction.rollback();
    throw new Error(err);
  }
};

const createGame = async (
  gameName: string,
  transaction: Transaction,
  matchID: number
) => {
  const gameModel = db[`Match_${gameName}`];

  await gameModel.create(
    {
      matchID,
    },
    { transaction }
  );
};

const createYahtzeeGame = async (transaction: Transaction, matchID: number) => {
  const dices: number[] = [];

  for (let i = 0; i < 5; i++) {
    const randDice: number = Math.ceil(Math.random() * 5);
    dices.push(randDice);
  }

  await db.Match_Yahtzee.create(
    {
      matchID: matchID,
      currentDices: JSON.stringify(dices),
    },
    { transaction }
  );
};

const createUnoGame = async (transaction: Transaction, matchID: number) => {
  const arrPlayers = ["user", "cpu1", "cpu2", "cpu3"];
  const randNum = Math.floor(Math.random() * 4);
  const nextPlayer = arrPlayers[randNum];

  const allCards: any[] = await db.Config_UnoCard.findAll({
    attributes: ["card"],
    raw: true,
  });

  if (allCards.length !== 60)
    throw new Error("A configuração de cartas está incorreta.");

  const arrCards = allCards.map((card: { card: string }) => card.card);

  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  const shuffledArray: string[] = shuffleArray(arrCards);
  const userCards = JSON.stringify(shuffledArray.splice(0, 5));
  const cpu1Cards = JSON.stringify(shuffledArray.splice(0, 5));
  const cpu2Cards = JSON.stringify(shuffledArray.splice(0, 5));
  const cpu3Cards = JSON.stringify(shuffledArray.splice(0, 5));

  await db.Match_Uno.create(
    {
      nextPlayer: nextPlayer,
      matchID,
      remainingCards: JSON.stringify(shuffledArray),
      userCards,
      cpu1Cards,
      cpu2Cards,
      cpu3Cards,
    },
    { transaction }
  );
};

export const processGameResult = async (matchID: number, result: string) => {
  const isProcessed: IMatchProcessing = await db.MatchProcessing.findOne({
    where: { matchID },
    raw: true,
  });

  if (isProcessed) {
    await db.Match.update(
      { matchProcessingID: isProcessed.id },
      { where: { id: matchID } }
    );

    return;
  }

  const resultTypes: IConfig_Result[] = await db.Config_Result.findAll({
    raw: true,
  });

  if (!resultTypes) throw createErrorObject("Resultados não encontrados.", 500);

  const resultData = resultTypes.filter((r) => r.result === result);

  if (resultData.length === 0)
    throw createErrorObject("Tipo de resultado informado é inválido.", 400);

  const match: IMatch = await db.Match.findOne({
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  const verifyXP: IGame = await db.Game.findOne({
    where: { id: match.gameID },
    raw: true,
  });

  if (!verifyXP) throw createErrorObject("Jogo não encontrado.", 500);

  const points = Number(verifyXP[`${result}_points` as keyof IPossiblePoints]);

  const userInfo: IUser = await db.User.findOne({
    where: { id: match.userID },
    raw: true,
  });

  if (!userInfo) throw createErrorObject("Usuário não encontrado.", 401);

  await db.User.update(
    { experience: Number(userInfo.experience) + points },
    { where: { id: userInfo.id } }
  );

  const processedData: IMatchProcessing = await db.MatchProcessing.create(
    { matchID, date: Date.now(), resultID: resultData[0].id },
    { raw: true }
  );

  await db.Match.update(
    { matchProcessingID: processedData.id },
    { where: { id: matchID } }
  );
};

export const createErrorObject = (message: string, status: number) => {
  const error = new Error(message);
  (error as any).message = message;
  (error as any).statusCode = status;

  return error;
};
