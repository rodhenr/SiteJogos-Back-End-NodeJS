import db from "../../models";

export const startNewGame = async (
  userID: number,
  gameID: number,
  date: Date
) => {
  const gameInfo = await db.Game.findOne({
    where: { id: gameID },
    raw: true,
  });

  if (!gameInfo) throw Error(`This game doesn't exist. Try again later.`);

  const newMatch = await db.Match.create(
    {
      userID,
      gameID,
      date,
    },
    { raw: true }
  );

  if (gameInfo.name === "TicTacToe") {
    await db.Match_TicTacToe.create({
      matchID: newMatch.dataValues.id,
      isUserMove: true,
    });
  }

  return newMatch;
};

export const processGameResult = async (matchID: number) => {};
