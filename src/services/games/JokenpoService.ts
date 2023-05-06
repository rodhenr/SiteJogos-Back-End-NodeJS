import { Op } from "sequelize";

import db from "../../models";

import {
  IJokenpoChoice,
  IJokenpoResultWithConfigResult,
  IMatchJokenpoWithMatch,
} from "../../interfaces/interfaces";

import { createErrorObject, processGameResult } from "./generalService";
import { conn } from "../../config/conn";

export const handlePlayerChoice = async (
  matchID: number,
  userChoice: string
) => {
  const match: IMatchJokenpoWithMatch = await db.Match_Jokenpo.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match["Match.matchProcessingID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  const possibleChoices: IJokenpoChoice[] =
    await db.Config_JokenpoChoice.findAll({
      raw: true,
    });

  const playerChoiceObj = possibleChoices.filter(
    (choice) => choice.choice === userChoice
  );

  const cpuChoiceID = Math.ceil(Math.random() * 3);

  const cpuChoiceObj = possibleChoices.filter(
    (choice) => choice.id === cpuChoiceID
  );

  if (
    !possibleChoices ||
    playerChoiceObj.length === 0 ||
    cpuChoiceObj.length === 0
  )
    throw createErrorObject("Jogada não reconhecida.", 400);

  const matchResult: IJokenpoResultWithConfigResult =
    await db.Config_JokenpoResult.findOne({
      where: {
        [Op.and]: [{ userChoiceID: playerChoiceObj[0].id }, { cpuChoiceID }],
      },
      include: [{ model: db.Config_Result }],
      raw: true,
    });

  if (!matchResult) throw createErrorObject("Resultado não encontrado.", 400);

  const transaction = await conn.transaction();

  try {
    await db.Match_Jokenpo.update(
      {
        userChoiceID: playerChoiceObj[0].id,
        cpuChoiceID: cpuChoiceID,
      },
      { where: { matchID } },
      transaction
    );

    await processGameResult(matchID, matchResult["Config_Result.result"]);

    await transaction.commit();

    return {
      userChoice,
      cpuChoice: cpuChoiceObj[0].choice,
      result: matchResult["Config_Result.result"],
    };
  } catch (err: any) {
    await transaction.rollback();
    throw new Error(err);
  }
};
