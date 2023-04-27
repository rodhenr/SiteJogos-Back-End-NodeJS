import { Transaction } from "sequelize";
import {
  ICardsObj,
  IConfigUnoCards,
  IMatchUnoWithMatch,
} from "../../interfaces/InfoInterface";
import db, { sequelize } from "../../models";
import { createErrorObject, processGameResult } from "./generalService";

export const getInitialData = async (matchID: number) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match["Match.matchProcessingID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  return {
    color: match.currentColor,
    cpu1Cards: JSON.parse(match.cpu1Cards).length,
    cpu2Cards: JSON.parse(match.cpu2Cards).length,
    cpu3Cards: JSON.parse(match.cpu3Cards).length,
    isClockwise: match.isClockwise,
    lastPlayedCard: match.lastCard,
    nextPlayer: match.nextPlayer,
    remainingCardsLength: JSON.parse(match.remainingCards).length,
    remainingPlayers: JSON.parse(match.remainingPlayers),
    userCards: JSON.parse(match.userCards),
  };
};

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

  const playerCards: string[] = JSON.parse(match.userCards);

  if (!playerCards.includes(card))
    throw createErrorObject("Carta inválida para o jogador.", 400);

  if ((card.startsWith("changeColor") || card.startsWith("plusFour")) && !color)
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

  const isValidPlay = await checkValidPlay(
    playerCardConfig,
    match,
    match.currentColor
  );

  if (!isValidPlay) throw createErrorObject("Jogada inválida.", 400);

  const data = handlePlay(match, playerCardConfig, playerCards, color);

  await db.Match_Uno.update(
    {
      currentColor: data.color,
      cpu1Cards: JSON.stringify(data.cpu1Cards),
      cpu2Cards: JSON.stringify(data.cpu2Cards),
      cpu3Cards: JSON.stringify(data.cpu3Cards),
      isClockwise: data.isClockwise,
      gameHistory: JSON.stringify(data.gameHistory),
      lastCard: card,
      nextPlayer: data.nextPlayer,
      remainingPlayers: JSON.stringify(data.remainingPlayers),
      userCards: JSON.stringify(data.userCards),
    },
    { where: { matchID } },
    transaction
  );

  await transaction.commit();
};

export const cpuAction = async (matchID: number) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const transaction = await sequelize.transaction();

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match["Match.matchProcessingID"] !== null)
    throw createErrorObject("Partida já encerrada.", 400);

  const player = match.nextPlayer;

  if (match.nextPlayer === "user")
    throw createErrorObject("Não é o turno do CPU.", 400);

  const remainingPlayers = JSON.parse(match.remainingPlayers);

  if (remainingPlayers.length < 2)
    return await handleGameOver(matchID, remainingPlayers, transaction);

  const cpuCards: string[] = JSON.parse(
    match[
      `${player}Cards` as keyof {
        cpu1Cards: string;
        cpu2Cards: string;
        cpu3Cards: string;
      }
    ]
  );

  // Verificar se alguma carta é uma jogada válida
  const arrValidMoves = await Promise.all(
    cpuCards.map(async (card) => {
      const playerCardConfig: IConfigUnoCards = await db.Config_UnoCard.findOne(
        {
          where: { card: card },
          raw: true,
        }
      );

      return await checkValidPlay(playerCardConfig, match, match.currentColor);
    })
  );

  const moveIndex = arrValidMoves.findIndex((move) => move === true);

  if (moveIndex === -1) {
    if (JSON.parse(match.remainingCards).length > 0) {
      await buyCardAction(matchID, player);

      return;
    } else {
      await skipTurnAction(matchID, player);

      return;
    }
  }

  const choosedCard = cpuCards[moveIndex];

  const playerCardConfig: IConfigUnoCards = await db.Config_UnoCard.findOne({
    where: { card: choosedCard },
    raw: true,
  });

  const colors = ["red", "blue", "green", "yellow"];
  const randNum = Math.ceil(Math.random() * 4);

  const data = handlePlay(match, playerCardConfig, cpuCards, colors[randNum]);

  await db.Match_Uno.update(
    {
      currentColor: data.color,
      cpu1Cards: JSON.stringify(data.cpu1Cards),
      cpu2Cards: JSON.stringify(data.cpu2Cards),
      cpu3Cards: JSON.stringify(data.cpu3Cards),
      isClockwise: data.isClockwise,
      gameHistory: JSON.stringify(data.gameHistory),
      lastCard: choosedCard,
      nextPlayer: data.nextPlayer,
      remainingPlayers: JSON.stringify(data.remainingPlayers),
      userCards: JSON.stringify(data.userCards),
    },
    { where: { matchID } },
    transaction
  );

  await transaction.commit();
};

const checkValidPlay = async (
  currentCard: IConfigUnoCards,
  match: IMatchUnoWithMatch,
  lastColor: null | string
) => {
  if (
    currentCard.is_plusFour ||
    currentCard.is_changeColor ||
    (!match.lastCard && !match.currentColor && !match.gameHistory)
  )
    return true;

  const lastCard: IConfigUnoCards = await db.Config_UnoCard.findOne({
    where: { card: match.lastCard },
    raw: true,
  });

  if (!lastCard) return false;

  if (
    (lastCard.is_block ||
      lastCard.is_reverse ||
      lastCard.is_plusTwo ||
      currentCard.is_block ||
      currentCard.is_reverse ||
      currentCard.is_plusTwo) &&
    lastCard.color === currentCard.color
  )
    return true;

  if (
    (lastCard.is_plusFour || lastCard.is_changeColor) &&
    lastColor === currentCard.color
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

const cardsAfterPlay = (cards: string[], choosedCard: string) => {
  const remainingCards = cards.filter((card) => card !== choosedCard);

  return remainingCards;
};

const handlePlay = (
  match: IMatchUnoWithMatch,
  choosedCard: IConfigUnoCards,
  cards: string[],
  color: null | string
) => {
  const cardsObj: any = {
    [`${match.nextPlayer}Cards`]: cardsAfterPlay(cards, choosedCard.card),
  };

  if (!cardsObj["cpu1Cards"]) cardsObj.cpu1Cards = JSON.parse(match.cpu1Cards);

  if (!cardsObj["cpu2Cards"]) cardsObj.cpu2Cards = JSON.parse(match.cpu2Cards);

  if (!cardsObj["cpu3Cards"]) cardsObj.cpu3Cards = JSON.parse(match.cpu3Cards);

  if (!cardsObj["userCards"]) cardsObj.userCards = JSON.parse(match.userCards);

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

  const remainingCards: string[] = JSON.parse(match.remainingCards);

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
    lastCard: choosedCard.card,
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

  const newCard: string[] = remainingCards.splice(0, 1);

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

export const skipTurnAction = async (matchID: number, player: string) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  if (match.nextPlayer !== player)
    throw createErrorObject("Não é o turno do jogador.", 400);

  const remainingPlayers = JSON.parse(match.remainingPlayers);
  const playerIndex = remainingPlayers.indexOf(player);

  const nextPlayer = findNextPlayer(
    remainingPlayers,
    playerIndex,
    match.isClockwise
  );

  await db.Match_Uno.update(
    {
      nextPlayer,
    },
    { where: { matchID } }
  );
};
