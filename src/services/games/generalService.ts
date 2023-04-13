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

  const newGame = await db.Match.create({
    userID,
    gameID,
    date,
    is_win: false,
    is_processed: false,
  });

  return newGame;
};
