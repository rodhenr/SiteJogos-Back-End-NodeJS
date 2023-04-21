import {
  IGame,
  IMatchProcessingHistory,
  IConfig_MatchResult,
  IMatch,
  IPossiblePoints,
  IUser,
} from "../../interfaces/InfoInterface";

import db, { sequelize } from "../../models";

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

  const transaction = await sequelize.transaction();

  try {
    const newMatch: IMatch = await db.Match.create(
      {
        userID,
        gameID,
        date,
      },
      { raw: true, transaction }
    );

    const gameModel = db[`Match_${gameInfo.name}`];

    await gameModel.create(
      {
        matchID: newMatch.id,
      },
      transaction
    );

    await transaction.commit();

    return newMatch;
  } catch (err: any) {
    await transaction.rollback();
    throw new Error(err);
  }
};

export const processGameResult = async (matchID: number, result: string) => {
  const isProcessed: IMatchProcessingHistory =
    await db.MatchProcessingHistory.findOne({
      where: { matchID },
      raw: true,
    });

  if (isProcessed) {
    await db.Match.update(
      { matchProcessingHistoryID: isProcessed.id },
      { where: { id: matchID } }
    );

    return;
  }

  const resultTypes: IConfig_MatchResult[] =
    await db.Config_MatchResult.findAll({
      raw: true,
    });

  if (!resultTypes) throw createErrorObject("Resultados não encontrados.", 500);

  const resultData = resultTypes.filter((r) => r.matchResult === result);

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

  const transaction = await sequelize.transaction();

  try {
    await db.User.update(
      { experience: Number(userInfo.experience) + points },
      { where: { id: userInfo.id } },
      transaction
    );

    const processedData: IMatchProcessingHistory =
      await db.MatchProcessingHistory.create(
        { matchID, date: Date.now(), matchResultID: resultData[0].id },
        { raw: true, transaction }
      );

    await db.Match.update(
      { matchProcessingHistoryID: processedData.id },
      { where: { id: matchID } },
      transaction
    );

    await transaction.commit();
    return;
  } catch (err: any) {
    await transaction.rollback();
    throw new Error(err);
  }
};

export const createErrorObject = (message: string, status: number) => {
  const error = new Error(message);
  (error as any).message = message;
  (error as any).statusCode = status;

  return error;
};
