import {
  IMatchTicTacToe,
  IMatchTicTacToeCells,
  IMatchTicTacToeWithMatch,
} from "../../interfaces/InfoInterface";
import db from "../../models";
import { createErrorObject, processGameResult } from "./generalService";

export const playerMovement = async (
  matchID: number,
  squarePosition: number
) => {
  const match: IMatchTicTacToeWithMatch = await db.Match_TicTacToe.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  await earlyMatchResultCheck(match, true);

  const cellPosition = `isUserCell_${squarePosition}` as keyof IMatchTicTacToe;

  if (
    !Object.keys(match).includes(cellPosition) ||
    match[cellPosition] !== null
  )
    throw createErrorObject("Posição de jogada inválida.", 400);

  await db.Match_TicTacToe.update(
    { [cellPosition]: 1, isUserMove: false },
    { where: { matchID: matchID } }
  );

  const updatedMatch: IMatchTicTacToeCells = await db.Match_TicTacToe.findOne({
    attributes: { exclude: ["id", "matchID", "isUserMove"] },
    where: { matchID },
    raw: true,
  });

  const isGameOver = await checkGameOver(updatedMatch, matchID);

  return {
    message: "Jogada efetuada.",
    isGameOver: isGameOver.isGameOver,
    isUserWin: isGameOver.isUserWin,
    isPlayerNext: false,
    cells: updatedMatch,
  };
};

export const cpuMovement = async (matchID: number, userID: number) => {
  const match: IMatchTicTacToeWithMatch = await db.Match_TicTacToe.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (match["Match.userID"] !== userID)
    throw createErrorObject("Usuário inválido para está partida", 401);

  await earlyMatchResultCheck(match, false);

  const possibleMoves = Object.keys(match).filter((key) => {
    return (
      key.startsWith("isUserCell") &&
      match[key as keyof IMatchTicTacToe] === null
    );
  });

  //Melhorar as escolhas tornariam a partida injusta?
  if (possibleMoves.length > 0) {
    const randomCol = Math.floor(Math.random() * possibleMoves.length);
    const choosedItem = possibleMoves[randomCol];

    await db.Match_TicTacToe.update(
      { [choosedItem]: 0, isUserMove: true },
      { where: { matchID } }
    );
  }

  const matchCells: IMatchTicTacToeCells = await db.Match_TicTacToe.findOne({
    attributes: { exclude: ["id", "matchID", "isUserMove"] },
    where: { matchID },
    raw: true,
  });

  const checkResultCPU = await checkGameOver(matchCells, matchID);

  if (checkResultCPU.isGameOver) {
    return {
      message: "Partida finalizada.",
      isGameOver: true,
      isUserWin: checkResultCPU.isUserWin,
      isPlayerNext: true,
      matchCells,
    };
  }

  return {
    message: "Jogada efetuada.",
    isGameOver: false,
    isUserWin: null,
    isPlayerNext: true,
    matchCells,
  };
};

const checkGameOver = async (cells: IMatchTicTacToeCells, matchID: number) => {
  const possibleWaysToWin: { [key: string]: boolean | null }[] = [
    {
      cell1: cells["isUserCell_1"],
      cell2: cells["isUserCell_2"],
      cell3: cells["isUserCell_3"],
    },
    {
      cell1: cells["isUserCell_4"],
      cell2: cells["isUserCell_5"],
      cell3: cells["isUserCell_6"],
    },
    {
      cell1: cells["isUserCell_7"],
      cell2: cells["isUserCell_8"],
      cell3: cells["isUserCell_9"],
    },
    {
      cell1: cells["isUserCell_1"],
      cell2: cells["isUserCell_4"],
      cell3: cells["isUserCell_7"],
    },
    {
      cell1: cells["isUserCell_2"],
      cell2: cells["isUserCell_5"],
      cell3: cells["isUserCell_8"],
    },
    {
      cell1: cells["isUserCell_3"],
      cell2: cells["isUserCell_6"],
      cell3: cells["isUserCell_9"],
    },
    {
      cell1: cells["isUserCell_1"],
      cell2: cells["isUserCell_5"],
      cell3: cells["isUserCell_9"],
    },
    {
      cell1: cells["isUserCell_3"],
      cell2: cells["isUserCell_5"],
      cell3: cells["isUserCell_7"],
    },
  ];

  const checkUserWin = possibleWaysToWin.some((item) => {
    return item.cell1 && item.cell2 && item.cell3;
  });

  const checkCPUWin = possibleWaysToWin.some((item) => {
    return (
      item.cell1 !== null &&
      !item.cell1 &&
      item.cell2 !== null &&
      !item.cell2 &&
      item.cell3 !== null &&
      !item.cell3
    );
  });

  const checkDraw = possibleWaysToWin.every((item) => {
    return item.cell1 !== null && item.cell2 !== null && item.cell3 !== null;
  });

  if (checkUserWin) {
    await processGameResult(matchID, "win");
    return { isGameOver: true, isUserWin: true };
  } else if (checkCPUWin) {
    await processGameResult(matchID, "lose");
    return { isGameOver: true, isUserWin: true };
  } else if (checkDraw) {
    await processGameResult(matchID, "draw");
    return { isGameOver: true, isUserWin: 0 };
  }

  return { isGameOver: false, isUserWin: null };
};

const earlyMatchResultCheck = async (
  match: IMatchTicTacToeWithMatch,
  isUser: boolean
) => {
  if (match["Match.matchProcessingHistoryID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  if (isUser && !match.isUserMove)
    throw createErrorObject("Não é o turno do jogador.", 400);

  if (!isUser && match.isUserMove)
    throw createErrorObject("Não é o turno do CPU.", 400);

  const matchCells = {
    isUserCell_1: match.isUserCell_1,
    isUserCell_2: match.isUserCell_2,
    isUserCell_3: match.isUserCell_3,
    isUserCell_4: match.isUserCell_4,
    isUserCell_5: match.isUserCell_5,
    isUserCell_6: match.isUserCell_6,
    isUserCell_7: match.isUserCell_7,
    isUserCell_8: match.isUserCell_8,
    isUserCell_9: match.isUserCell_9,
  };

  const checkResult = await checkGameOver(matchCells, match.matchID);

  if (checkResult.isGameOver)
    throw createErrorObject("Partida já encerrada.", 400);
};
