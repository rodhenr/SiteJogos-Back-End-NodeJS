import { Transaction } from "sequelize";
import {
  ICardsObj,
  IConfigUnoCards,
  IMatchUnoWithMatch,
} from "../../interfaces/InfoInterface";
import db, { sequelize } from "../../models";
import { createErrorObject, processGameResult } from "./generalService";

export const playerAction = async (
  matchID: number,
  card: string,
  color: null | string = null
) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const transaction = await sequelize.transaction();

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match["Match.matchProcessingID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  if (match.nextPlayer !== "user")
    throw createErrorObject("Não é o turno do jogador.", 400);

  if (card.startsWith("plusFour") || (card.startsWith("changeColor") && !color))
    throw createErrorObject("Cor não selecionada.", 400);

  const remainingPlayers = JSON.parse(match.remainingPlayers);

  if (remainingPlayers.length < 2)
    return await handleGameOver(matchID, remainingPlayers, transaction);

  const playerCardConfig: IConfigUnoCards = await db.Config_UnoCard.findOne({
    where: { card },
    raw: true,
  });

  if (!playerCardConfig)
    throw createErrorObject("Carta inválida para o jogador.", 400);

  const choosedCardID: number = playerCardConfig.id;
  const playerCards: number[] = JSON.parse(match.userCards);

  if (!playerCards.includes(choosedCardID))
    throw createErrorObject("Carta inválida para o jogador.", 400);

  const isValidPlay = await checkValidPlay(
    playerCardConfig,
    match,
    choosedCardID
  );

  if (!isValidPlay) throw createErrorObject("Jogada inválida.", 400);

  const data = dataAfterPlay(
    match,
    playerCardConfig,
    choosedCardID,
    playerCards,
    color
  );

  await db.Match_Uno.update(
    {
      currentColor: data.color,
      cpu1Cards: JSON.stringify(data.cpu1Cards),
      cpu2Cards: JSON.stringify(data.cpu2Cards),
      cpu3Cards: JSON.stringify(data.cpu3Cards),
      isClockwise: data.isClockwise,
      gameHistory: JSON.stringify(data.gameHistory),
      lastCardID: choosedCardID,
      nextPlayer: data.nextPlayer,
      remainingPlayers: JSON.stringify(data.remainingPlayers),
      userCards: JSON.stringify(data.userCards),
    },
    { where: { matchID } },
    transaction
  );

  await transaction.commit();

  return {
    color: data.color,
    cpu1Cards: data.cpu1Cards,
    cpu2Cards: data.cpu2Cards,
    cpu3Cards: data.cpu3Cards,
    isClockwise: data.isClockwise,
    lastPlayedCard: card,
    nextPlayer: data.nextPlayer,
    remainingCardsLength: data.remainingCards.length,
    remainingPlayers: data.remainingPlayers,
    userCards: data.userCards,
  };
};

export const cpuAction = async (matchID: number, player: string) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const transaction = await sequelize.transaction();

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match["Match.matchProcessingID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  if (match.nextPlayer !== player)
    throw createErrorObject("Não é o turno do jogador.", 400);

  const remainingPlayers = JSON.parse(match.remainingPlayers);

  if (remainingPlayers.length < 2)
    return await handleGameOver(matchID, remainingPlayers, transaction);

  // Verificar se alguma carta é uma jogada válida
  // Se não for, comprar uma carta
  // Se não existirem mais cartas, pular a rodada

  /* const isValidPlay = await checkValidPlay(playerCardConfig, match, choosedCardID);

  if (!isValidPlay) throw createErrorObject("Jogada inválida.", 400);

  const data = dataAfterPlay(
    match,
    playerCardConfig,
    choosedCardID,
    playerCards,
    color
  );

  await db.Match_Uno.update(
    {
      currentColor: data.color,
      cpu1Cards: JSON.stringify(data.cpu1Cards),
      cpu2Cards: JSON.stringify(data.cpu2Cards),
      cpu3Cards: JSON.stringify(data.cpu3Cards),
      isClockwise: data.isClockwise,
      gameHistory: JSON.stringify(data.gameHistory),
      lastCardID: choosedCardID,
      nextPlayer: data.nextPlayer,
      remainingPlayers: JSON.stringify(data.remainingPlayers),
      userCards: JSON.stringify(data.userCards),
    },
    { where: { matchID } },
    transaction
  );

  await transaction.commit();

  return {
    color: data.color,
    cpu1Cards: data.cpu1Cards,
    cpu2Cards: data.cpu2Cards,
    cpu3Cards: data.cpu3Cards,
    isClockwise: data.isClockwise,
    lastPlayedCard: card,
    nextPlayer: data.nextPlayer,
    remainingCardsLength: data.remainingCards.length,
    remainingPlayers: data.remainingPlayers,
    userCards: data.userCards,
  }; */
};

const checkValidPlay = async (
  currentCard: IConfigUnoCards,
  match: IMatchUnoWithMatch,
  choosedCardID: number
) => {
  if (
    currentCard.is_plusFour ||
    currentCard.is_changeColor ||
    (!match.lastCardID && !match.currentColor && !match.gameHistory)
  ) {
    return true;
  } else {
    const lastCard: any = await db.Config_UnoCard.findOne({
      where: { id: match.lastCardID },
      raw: true,
    });

    if (!lastCard) return false;

    if (
      (currentCard.is_block ||
        currentCard.is_reverse ||
        currentCard.is_plusTwo) &&
      lastCard.color === currentCard.color
    )
      return true;

    if (
      (lastCard.is_block || lastCard.is_reverse || lastCard.is_plusTwo) &&
      lastCard.color === currentCard.color
    )
      return true;

    if (
      lastCard.is_num &&
      currentCard.is_num &&
      (lastCard.value === currentCard.value ||
        lastCard.color === currentCard.color)
    )
      return true;

    return false;
  }
};

const findNextPlayer = (
  players: string[],
  currentPlayerIndex: number,
  isClockwise: boolean
) => {
  if (isClockwise) {
    return players[(currentPlayerIndex + 1) % players.length];
  } else {
    return players[(currentPlayerIndex - 1 + players.length) % players.length];
  }
};

const findNextPlayerWithCard = (
  players: string,
  currentPlayer: string,
  beforeIsClockwise: boolean,
  card: string
) => {
  const remainingPlayers: string[] = JSON.parse(players);
  const indexOfCurrentPlayer = remainingPlayers.indexOf(currentPlayer);
  if (indexOfCurrentPlayer === -1) throw new Error("Jogador não permitido.");

  if (card.startsWith("block")) {
    if (beforeIsClockwise) {
      return remainingPlayers[
        (indexOfCurrentPlayer + 2) % remainingPlayers.length
      ];
    } else {
      return remainingPlayers[
        (indexOfCurrentPlayer - 2 + remainingPlayers.length) %
          remainingPlayers.length
      ];
    }
  } else if (card.startsWith("reverse")) {
    if (beforeIsClockwise) {
      return remainingPlayers[
        (indexOfCurrentPlayer - 1 + remainingPlayers.length) %
          remainingPlayers.length
      ];
    } else {
      return remainingPlayers[
        (indexOfCurrentPlayer + 1) % remainingPlayers.length
      ];
    }
  } else {
    if (beforeIsClockwise) {
      return remainingPlayers[
        (indexOfCurrentPlayer + 1) % remainingPlayers.length
      ];
    } else {
      return remainingPlayers[
        (indexOfCurrentPlayer - 1 + remainingPlayers.length) %
          remainingPlayers.length
      ];
    }
  }
};

const cardsAfterPlay = (cards: number[], choosedCardID: number) => {
  const remainingCards = cards.filter((card) => card !== choosedCardID);

  return remainingCards;
};

const dataAfterPlay = (
  match: IMatchUnoWithMatch,
  choosedCard: IConfigUnoCards,
  choosedCardID: number,
  cards: number[],
  color: null | string
) => {
  const cardsObj: ICardsObj = {
    userCards: cardsAfterPlay(cards, choosedCardID),
    cpu1Cards: JSON.parse(match.cpu1Cards),
    cpu2Cards: JSON.parse(match.cpu2Cards),
    cpu3Cards: JSON.parse(match.cpu3Cards),
  };

  const gameHistory: string[] = match.gameHistory
    ? JSON.parse(match.gameHistory)
    : [];

  gameHistory.push(choosedCard.card);

  const nextPlayer: string = findNextPlayerWithCard(
    match.remainingPlayers,
    match.nextPlayer,
    match.isClockwise,
    choosedCard.card
  );

  const remainingCards: number[] = JSON.parse(match.remainingCards);

  const nextPlayerWithName = `${nextPlayer}Cards`;

  if (choosedCard.card.startsWith("plusTwo")) {
    cardsObj[nextPlayerWithName as keyof ICardsObj].push(
      ...remainingCards.splice(0, 2)
    );
  } else if (choosedCard.card.startsWith("plusFour")) {
    cardsObj[nextPlayerWithName as keyof ICardsObj].push(
      ...remainingCards.splice(0, 4)
    );
  }

  let hasNoCardsLeft = false;

  if (cardsObj[`${match.nextPlayer}Cards` as keyof ICardsObj].length === 0) {
    hasNoCardsLeft = true;
  }

  const remainingPlayers = JSON.parse(match.remainingPlayers);
  const playerIndex = remainingPlayers.indexOf(match.nextPlayer);

  if (hasNoCardsLeft) {
    remainingPlayers.splice(playerIndex, 1);
  }

  return {
    color: choosedCard.color ?? color,
    cpu1Cards: cardsObj.cpu1Cards,
    cpu2Cards: cardsObj.cpu2Cards,
    cpu3Cards: cardsObj.cpu3Cards,
    gameHistory,
    hasNoCardsLeft,
    isClockwise: choosedCard.card.startsWith("reverse")
      ? !match.isClockwise
      : match.isClockwise,
    lastCardID: choosedCardID,
    nextPlayer,
    remainingCards,
    remainingPlayers,
    userCards: cardsObj.userCards,
  };
};

const handleGameOver = async (
  matchID: number,
  remainingPlayers: string[],
  transaction: Transaction
) => {
  const data = await processGameResult(
    matchID,
    remainingPlayers.includes("user") ? "lose" : "win",
    transaction
  );

  return data;
};

export const buyCardAction = async (matchID: number, player: string) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match.nextPlayer !== player)
    throw createErrorObject("Não é o turno do jogador.", 400);

  const remainingCards = JSON.parse(match.remainingCards);

  if (remainingCards.length === 0)
    throw createErrorObject("Não existem cartas restantes.", 400);

  const cardsObj: ICardsObj = {
    userCards: JSON.parse(match.userCards),
    cpu1Cards: JSON.parse(match.cpu1Cards),
    cpu2Cards: JSON.parse(match.cpu2Cards),
    cpu3Cards: JSON.parse(match.cpu3Cards),
  };

  const remainingPlayers = JSON.parse(match.remainingPlayers);
  const playerIndex = remainingPlayers.indexOf(player);

  const nextPlayer = findNextPlayer(
    remainingPlayers,
    playerIndex,
    match.isClockwise
  );

  const newCard: number[] = remainingCards.splice(0, 1);

  cardsObj[`${player}Cards` as keyof ICardsObj].push(...newCard);

  await db.Match_Uno.update(
    {
      userCards: JSON.stringify(cardsObj.userCards),
      cpu1Cards: JSON.stringify(cardsObj.cpu1Cards),
      cpu2Cards: JSON.stringify(cardsObj.cpu2Cards),
      cpu3Cards: JSON.stringify(cardsObj.cpu3Cards),
      remainingCards: JSON.stringify(remainingCards),
      nextPlayer,
    },
    { where: { matchID } }
  );
};
