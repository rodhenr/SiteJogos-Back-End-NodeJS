import db from "../../models";

import { IMatchTicTacToeWithMatch } from "../../interfaces/InfoInterface";

import { createErrorObject } from "./generalService";

export const handlePlayerChoice = async (
  matchID: number,
  playerChoice: string
) => {
  const match: IMatchTicTacToeWithMatch = await db.Match_TicTacToe.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  const config_choice: IMatchTicTacToeWithMatch =
    await db.Config_JokenpoChoice.findOne({
      where: { choice: playerChoice },
      raw: true,
    });

  if (!config_choice) throw createErrorObject("Jogada não reconhecida.", 400);

  const cpuChoiceID = Math.ceil(Math.random() * 3);

  //Descobrir qual foi a escolha do cpu
  //Comparar na tabela de resultados player vs cpu
  //Retonar resultado (join com tabela resultado)
};
