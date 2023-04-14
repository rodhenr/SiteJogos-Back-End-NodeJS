import db from "../../models";

export const playerMovement = async (
  userID: number,
  matchID: number,
  squarePosition: number
) => {
  const match = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw new Error("Partida não encontrada.");

  if (match.is_win || match.is_processed)
    return { message: "Partida já encerrada.", isGameOver: false };

  if (!match["Match_TicTacToe.isUserMove"])
    return { message: "Não é a vez do usuário jogar.", isGameOver: false };

  const cellPosition = `Match_TicTacToe.isUserCell_${squarePosition}`;

  if (match[cellPosition] !== null)
    return { message: "Posição de jogada inválida.", isGameOver: false };

  const update = {
    [`isUserCell_${squarePosition}`]: 1,
    isUserMove: false,
  };

  await db.Match_TicTacToe.update(update, { where: { matchID: matchID } });

  const isGameOver = await checkGameOver(matchID);

  return { message: "Jogada efetuada.", isGameOver: isGameOver };
};

const checkGameOver = async (matchID: number) => {
  const match = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw Error("Partida não encontrada.");

  if (match.is_win || match.is_processed) return true;

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

  const checkWin = possibleWaysToWin.some((item) => {
    const values = Object.values(item);

    const allTrue = values.every((value) => value);
    const allFalse = values.every((value) => value === false);

    if (allTrue || allFalse) return true;

    return false;
  });

  if (checkWin) {
    await db.Match.update({ is_win: true }, { where: { id: matchID } });
    return true;
  } else {
    return false;
  }
};
