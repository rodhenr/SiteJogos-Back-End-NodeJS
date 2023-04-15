import {
  IMatchTicTacToe,
  IMatchTicTacToeIncluded,
} from "../../interfaces/InfoInterface";
import db from "../../models";
import { processGameResult } from "./generalService";

export const playerMovement = async (
  userID: number,
  matchID: number,
  squarePosition: number
) => {
  const match: IMatchTicTacToeIncluded = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw new Error("Partida não encontrada.");

  if (match.is_win !== null) {
    if (match.is_processed) {
      return {
        message: "Partida já encerrada.",
        isGameOver: true,
        isUserWin: match.is_win,
      };
    } else {
      await processGameResult(matchID);
      return {
        message: "Partida já encerrada.",
        isGameOver: true,
        isUserWin: match.is_win,
      };
    }
  }

  const checkResult = await checkGameOver(matchID);

  if (checkResult.isGameOver) {
    return {
      message: "Partida já encerrada.",
      isGameOver: true,
      isUserWin: checkResult.isUserWin,
    };
  }

  !match["Match_TicTacToe.isUserMove"] && (await cpuMovement(matchID));

  let cellNameWithRelation =
    `Match_TicTacToe.isUserCell_${squarePosition}` as keyof IMatchTicTacToeIncluded;

  if (
    !Object.keys(match).includes(cellNameWithRelation) ||
    match[cellNameWithRelation] !== null
  )
    return {
      message: "Posição de jogada inválida.",
      isGameOver: false,
      isUserWin: null,
    };

  const cellPosition = `isUserCell_${squarePosition}` as keyof IMatchTicTacToe;

  await db.Match_TicTacToe.update(
    { [cellPosition]: 1, isUserMove: false },
    { where: { matchID: matchID } }
  );

  const isGameOver = await checkGameOver(matchID);

  return {
    message: "Jogada efetuada.",
    isGameOver: isGameOver.isGameOver,
    isUserWin: isGameOver.isUserWin,
  };
};

export const cpuMovement = async (matchID: number) => {
  const match = await db.Match_TicTacToe.findOne({
    where: { matchID },
    raw: true,
  });

  if (match.isUserMove) return;

  const possibleMoves = Object.keys(match).filter((key) => {
    return key.startsWith("isUserCell") && match[key] === null;
  });

  //Melhorar as escolhas tornariam a partida injusta?
  if (possibleMoves.length > 0) {
    const randomCol = Math.floor(Math.random() * possibleMoves.length);
    const choosedItem = possibleMoves[randomCol];

    await db.Match_TicTacToe.update(
      { [choosedItem]: 0 },
      { where: { matchID } }
    );
  }

  return;
};

const checkGameOver = async (matchID: number) => {
  const match: IMatchTicTacToeIncluded = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

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
    const values = Object.values(item);
    const checkResult = values.every((value) => value);

    return checkResult;
  });

  const checkCPUWin = possibleWaysToWin.some((item) => {
    const values = Object.values(item);
    const checkResult = values.every((value) => value === false);

    return checkResult;
  });

  const checkDraw = Object.keys(match).filter((key) => {
    return (
      key.startsWith("Match_TicTacToe.isUserCell") &&
      match[key as keyof IMatchTicTacToeIncluded] === null
    );
  });

  if (checkUserWin) {
    await db.Match.update({ is_win: true }, { where: { id: matchID } });
    return { isGameOver: true, isUserWin: true };
  } else if (checkCPUWin) {
    await db.Match.update({ is_win: false }, { where: { id: matchID } });
    return { isGameOver: true, isUserWin: true };
  } else if (checkDraw.length === 0) {
    await db.Match.update({ is_win: false }, { where: { id: matchID } });
    return { isGameOver: true, isUserWin: 0 };
  } else {
    return { isGameOver: false, isUserWin: null };
  }
};
