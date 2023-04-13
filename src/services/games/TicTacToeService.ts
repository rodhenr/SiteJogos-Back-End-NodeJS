import db from "../../models";

export const selectSquare = async (matchID: number, squarePosition: number) => {
  const match = await db.Match.findOne({
    include: [{ model: db.Match_TicTacToe }],
    where: { id: matchID },
    raw: true,
  });

  if (!match) throw Error("Partida não encontrada.");

  //Fazer a jogada
  //Verificar se terminou o jogo
  //Retornar algo para o usuário
};
