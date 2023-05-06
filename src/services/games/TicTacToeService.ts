import { Transaction } from "sequelize";
import {
  IMatchTicTacToe,
  IMatchTicTacToeCells,
  IMatchTicTacToeWithMatch,
} from "../../interfaces/interfaces";
import db from "../../models";
import { createErrorObject, processGameResult } from "./generalService";
import { conn } from "../../config/conn";

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

  if (!match.isUserMove)
    throw createErrorObject("Não é o turno do jogador.", 400);

  const cellPosition = `isUserCell_${squarePosition}` as keyof IMatchTicTacToe;

  if (
    !Object.keys(match).includes(cellPosition) ||
    match[cellPosition] !== null
  )
    throw createErrorObject("Posição de jogada inválida.", 400);

  const transaction = await conn.transaction();

  try {
    await db.Match_TicTacToe.update(
      { [cellPosition]: 1, isUserMove: false },
      { where: { matchID: matchID } },
      transaction
    );

    const updatedMatch: IMatchTicTacToeCells = await db.Match_TicTacToe.findOne(
      {
        attributes: { exclude: ["id", "matchID", "isUserMove"] },
        where: { matchID },
        raw: true,
      }
    );

    const isGameOver: { isGameOver: boolean; result: string | null } =
      await checkGameOver(updatedMatch, matchID, transaction);

    await transaction.commit();

    return {
      cells: Object.values(updatedMatch),
      gameResult: isGameOver.result,
      isGameOver: isGameOver.isGameOver,
      isPlayerNext: false,
      message: "Jogada efetuada.",
    };
  } catch (err: any) {
    console.log(err);
    await transaction.rollback();
    throw new Error(err);
  }
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

  if (match.isUserMove) throw createErrorObject("Não é o turno do CPU.", 400);

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

  const transaction = await conn.transaction();

  try {
    const checkResultCPU = await checkGameOver(
      matchCells,
      matchID,
      transaction
    );

    await transaction.commit();

    if (checkResultCPU.isGameOver) {
      return {
        message: "Partida finalizada.",
        isGameOver: true,
        gameResult: checkResultCPU.result,
        isPlayerNext: true,
        cells: Object.values(matchCells),
      };
    }

    return {
      message: "Jogada efetuada.",
      isGameOver: false,
      gameResult: null,
      isPlayerNext: true,
      cells: Object.values(matchCells),
    };
  } catch (err: any) {
    await transaction.rollback();
    throw new Error(err);
  }
};

const checkGameOver = async (
  cells: IMatchTicTacToeCells,
  matchID: number,
  transaction: Transaction
) => {
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

  const checkUserWin = possibleWaysToWin.some(
    (item) => item.cell1 && item.cell2 && item.cell3
  );

  const checkCPUWin = possibleWaysToWin.some(
    (item) =>
      item.cell1 === false && item.cell2 === false && item.cell3 === false
  );

  const checkDraw = possibleWaysToWin.every(
    (item) => item.cell1 !== null && item.cell2 !== null && item.cell3 !== null
  );

  try {
    if (checkUserWin) {
      await processGameResult(matchID, "win");
      return { isGameOver: true, result: "win" };
    } else if (checkCPUWin) {
      await processGameResult(matchID, "lose");
      return { isGameOver: true, result: "lose" };
    } else if (checkDraw) {
      await processGameResult(matchID, "draw");
      return { isGameOver: true, result: "draw" };
    }

    return { isGameOver: false, result: null };
  } catch (err: any) {
    console.log(err);
    throw new Error(err);
  }
};

const earlyMatchResultCheck = async (
  match: IMatchTicTacToeWithMatch,
  isUser: boolean
) => {
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

  const transaction = await conn.transaction();

  try {
    const checkResult = await checkGameOver(
      matchCells,
      match.matchID,
      transaction
    );

    if (checkResult.isGameOver)
      throw createErrorObject("Partida já encerrada.", 400);

    await transaction.commit();
  } catch (err: any) {
    await transaction.rollback();
    throw new Error(err);
  }
};
