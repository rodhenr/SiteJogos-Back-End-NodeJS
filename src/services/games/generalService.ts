import db from "../../models";

export const startNewGame = async (
  userID: number,
  gameID: number,
  date: Date
) => {
  const isGameExist = await db.Game.findOne({
    where: { id: gameID },
    raw: true,
  });

  if (!isGameExist) throw Error(`This game doesn't exist. Try again later.`);

  const newMatch = await db.Match.create(
    {
      userID,
      gameID,
      date,
      is_win: false,
      is_processed: false,
    },
    { raw: true }
  );

  if (isGameExist.name === "TicTacToe") {
    await db.Match_TicTacToe.create({
      matchID: newMatch.dataValues.id,
      isUserMove: true,
    });
  }

  return newMatch;
};
