import {
  IMatchTicTacToe,
  IMatchTicTacToeIncluded,
} from "../../interfaces/InfoInterface";
import db from "../../models";
import { createErrorObject, processGameResult } from "./generalService";

export const playerMovement = async (
  matchID: number,
  squarePosition: number
) => {
  const match: IMatchTicTacToeIncluded = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match.matchProcessingHistoryID !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  const checkResult = await checkGameOver(match);

  if (checkResult.isGameOver)
    throw createErrorObject("Partida já encerrada.", 400);

  const cpuMove =
    !match["Match_TicTacToe.isUserMove"] && (await cpuMovement(matchID));

  if (cpuMove && cpuMove.isGameOver)
    return {
      message: "Jogada efetuada.",
      isGameOver: cpuMove.isGameOver,
      isUserWin: cpuMove.isUserWin,
    };

  let cellNameWithRelation =
    `Match_TicTacToe.isUserCell_${squarePosition}` as keyof IMatchTicTacToeIncluded;

  if (
    !Object.keys(match).includes(cellNameWithRelation) ||
    match[cellNameWithRelation] !== null
  )
    throw createErrorObject("Posição de jogada inválida.", 400);

  const cellPosition = `isUserCell_${squarePosition}` as keyof IMatchTicTacToe;

  await db.Match_TicTacToe.update(
    { [cellPosition]: 1, isUserMove: false },
    { where: { matchID: matchID } }
  );

  const isGameOver = await checkGameOver(match);

  return {
    message: "Jogada efetuada.",
    isGameOver: isGameOver.isGameOver,
    isUserWin: isGameOver.isUserWin,
  };
};

export const cpuMovement = async (matchID: number) => {
  const match: IMatchTicTacToe = await db.Match_TicTacToe.findOne({
    where: { matchID },
    raw: true,
  });

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

  const matchCPU: IMatchTicTacToeIncluded = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  const checkResultCPU = await checkGameOver(matchCPU);

  if (checkResultCPU.isGameOver) {
    return {
      message: "Jogada efetuada.",
      isGameOver: true,
      isUserWin: checkResultCPU.isUserWin,
    };
  }

  return {
    message: null,
    isGameOver: false,
    isUserWin: null,
  };
};

const checkGameOver = async (match: IMatchTicTacToeIncluded) => {
  const possibleWaysToWin: { [key: string]: boolean | null }[] = [
    {
      cell1: match["Match_TicTacToe.isUserCell_1"],
      cell2: match["Match_TicTacToe.isUserCell_2"],
      cell3: match["Match_TicTacToe.isUserCell_3"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_4"],
      cell2: match["Match_TicTacToe.isUserCell_5"],
      cell3: match["Match_TicTacToe.isUserCell_6"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_7"],
      cell2: match["Match_TicTacToe.isUserCell_8"],
      cell3: match["Match_TicTacToe.isUserCell_9"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_1"],
      cell2: match["Match_TicTacToe.isUserCell_4"],
      cell3: match["Match_TicTacToe.isUserCell_7"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_2"],
      cell2: match["Match_TicTacToe.isUserCell_5"],
      cell3: match["Match_TicTacToe.isUserCell_8"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_3"],
      cell2: match["Match_TicTacToe.isUserCell_6"],
      cell3: match["Match_TicTacToe.isUserCell_9"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_1"],
      cell2: match["Match_TicTacToe.isUserCell_5"],
      cell3: match["Match_TicTacToe.isUserCell_9"],
    },
    {
      cell1: match["Match_TicTacToe.isUserCell_3"],
      cell2: match["Match_TicTacToe.isUserCell_5"],
      cell3: match["Match_TicTacToe.isUserCell_7"],
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

  const checkDraw = Object.keys(match).filter((key) => {
    return (
      key.startsWith("Match_TicTacToe.isUserCell") &&
      match[key as keyof IMatchTicTacToeIncluded] === null
    );
  });

  if (checkUserWin) {
    await processGameResult(match.id, "win");
    return { isGameOver: true, isUserWin: true };
  } else if (checkCPUWin) {
    await processGameResult(match.id, "lose");
    return { isGameOver: true, isUserWin: true };
  } else if (checkDraw.length === 0) {
    await processGameResult(match.id, "draw");
    return { isGameOver: true, isUserWin: 0 };
  }

  return { isGameOver: false, isUserWin: null };
};
