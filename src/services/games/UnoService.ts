import { Transaction } from "sequelize";
import {
  ICardsObj,
  IConfigUnoCards,
  IMatchProcessingWithResult,
  IMatchUnoWithMatch,
} from "../../interfaces/interfaces";
import db from "../../models";
import { conn } from "../../config/conn";
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
    turn: !match.turn ? 1 : match.turn + 1,
  };
};

export const playerAction = async (
  matchID: number,
  card: string,
  color: null | string = null
) => {
  const transaction = await conn.transaction();

  try {
    const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
      include: [{ model: db.Match }],
      where: { matchID },
      raw: true,
    });

    if (!match) throw createErrorObject("Partida não encontrada.", 400);

    if (match["Match.matchProcessingID"] !== null)
      throw createErrorObject("Partida já encerrada.", 400);

    if (match.nextPlayer !== "user")
      throw createErrorObject("Não é o turno do jogador.", 400);

    const playerCards: string[] = JSON.parse(match.userCards);

    if (!playerCards.includes(card))
      throw createErrorObject("Carta inválida para o jogador.", 400);

    if (
      (card.startsWith("changeColor") || card.startsWith("plusFour")) &&
      !color
    )
      throw createErrorObject("Cor não selecionada.", 400);

    const isGameOver: boolean = await checkGameOver(matchID);

    if (isGameOver) return;

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
        remainingCards: JSON.stringify(data.remainingCards),
        remainingPlayers: JSON.stringify(data.remainingPlayers),
        userCards: JSON.stringify(data.userCards),
      },
      { where: { matchID } },
      transaction
    );

    await transaction.commit();
  } catch (err: any) {
    await transaction.rollback();
    if (err?.statusCode && err?.mesage) {
      throw createErrorObject(err.message, err.statusCode);
    } else {
      console.log(err);
      throw new Error(err);
    }
  }
};

export const cpuAction = async (matchID: number) => {
  try {
    const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
      include: [{ model: db.Match }],
      where: { matchID },
      raw: true,
    });

    if (!match) throw createErrorObject("Partida não encontrada.", 400);

    if (match["Match.matchProcessingID"] !== null)
      throw createErrorObject("Partida já encerrada.", 400);

    const player = match.nextPlayer;

    if (match.nextPlayer === "user")
      throw createErrorObject("Não é o turno do CPU.", 400);

    const isGameOver: boolean = await checkGameOver(matchID);

    if (isGameOver) return;

    const cpuCards: string[] = JSON.parse(
      match[
        `${player}Cards` as keyof {
          cpu1Cards: string;
          cpu2Cards: string;
          cpu3Cards: string;
        }
      ]
    );

    const arrValidMoves = await Promise.all(
      cpuCards.map(async (card) => {
        const playerCardConfig: IConfigUnoCards =
          await db.Config_UnoCard.findOne({
            where: { card: card },
            raw: true,
          });

        return await checkValidPlay(
          playerCardConfig,
          match,
          match.currentColor
        );
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
        remainingCards: JSON.stringify(data.remainingCards),
        remainingPlayers: JSON.stringify(data.remainingPlayers),
        turn: data.turn,
        userCards: JSON.stringify(data.userCards),
      },
      { where: { matchID } }
    );
  } catch (err: any) {
    console.log(err);
    if (err?.statusCode && err?.mesage) {
      throw createErrorObject(err.message, err.statusCode);
    } else {
      throw new Error(err);
    }
  }
};

export const buyCardAction = async (matchID: number, player: string) => {
  try {
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
        turn: !match.turn ? 1 : match.turn + 1,
      },
      { where: { matchID } }
    );
  } catch (err: any) {
    if (err?.statusCode && err?.mesage) {
      throw createErrorObject(err.message, err.statusCode);
    } else {
      throw new Error(err);
    }
  }
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
      turn: !match.turn ? 1 : match.turn + 1,
    },
    { where: { matchID } }
  );
};

export const getUnoMatchState = async (matchID: number) => {
  const data: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const dataMatchOver: IMatchProcessingWithResult =
    await db.MatchProcessing.findOne({
      include: [{ model: db.Config_Result }],
      where: { matchID },
      raw: true,
    });

  return {
    color: data.currentColor,
    cpu1CardsLength: JSON.parse(data.cpu1Cards).length,
    cpu2CardsLength: JSON.parse(data.cpu2Cards).length,
    cpu3CardsLength: JSON.parse(data.cpu3Cards).length,
    isClockwise: data.isClockwise,
    isGameOver: dataMatchOver ? true : false,
    gameResult: dataMatchOver ? dataMatchOver["Config_Result.result"] : null,
    lastCard: data.lastCard,
    matchID: matchID,
    nextPlayer: data.nextPlayer,
    remainingCardsLength: JSON.parse(data.remainingCards).length,
    remainingPlayers: JSON.parse(data.remainingPlayers),
    userCards: JSON.parse(data.userCards),
    turn: data.turn,
  };
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
    if (remainingCards.length < 2) {
      cardsObj[nextPlayerWithName as keyof ICardsObj].push(
        ...remainingCards.splice(0, remainingCards.length)
      );
    } else {
      cardsObj[nextPlayerWithName as keyof ICardsObj].push(
        ...remainingCards.splice(0, 2)
      );
    }
  } else if (choosedCard.card.startsWith("plusFour")) {
    if (remainingCards.length < 4) {
      cardsObj[nextPlayerWithName as keyof ICardsObj].push(
        ...remainingCards.splice(0, remainingCards.length)
      );
    } else {
      cardsObj[nextPlayerWithName as keyof ICardsObj].push(
        ...remainingCards.splice(0, 4)
      );
    }
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
    turn: !match.turn ? 1 : match.turn + 1,
    userCards: cardsObj.userCards,
  };
};

const hasPlayerWithRemainingMove = async (match: IMatchUnoWithMatch) => {
  try {
    const cpu1CheckMoves = await checkArrMoves(
      JSON.parse(match.cpu1Cards),
      match
    );
    const cpu2CheckMoves = await checkArrMoves(
      JSON.parse(match.cpu2Cards),
      match
    );
    const cpu3CheckMoves = await checkArrMoves(
      JSON.parse(match.cpu3Cards),
      match
    );
    const userCheckMoves = await checkArrMoves(
      JSON.parse(match.userCards),
      match
    );

    return [cpu1CheckMoves, cpu2CheckMoves, cpu3CheckMoves, userCheckMoves];
  } catch (err: any) {
    throw new Error(err);
  }
};

const checkArrMoves = async (arr: string[], match: IMatchUnoWithMatch) => {
  const checkMoves = await Promise.all(
    arr.map(async (card: string) => {
      const playerCardConfig: IConfigUnoCards = await db.Config_UnoCard.findOne(
        {
          where: { card: card },
          raw: true,
        }
      );

      return await checkValidPlay(playerCardConfig, match, match.currentColor);
    })
  );

  const hasValidMovesUser: number = checkMoves.findIndex(
    (move) => move === true
  );

  return hasValidMovesUser === -1 ? false : true;
};

export const checkGameOver = async (matchID: number) => {
  const match: IMatchUnoWithMatch = await db.Match_Uno.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const remainingPlayers = JSON.parse(match.remainingPlayers);
  const remainingCards = JSON.parse(match.remainingCards);
  const arrMoves = await hasPlayerWithRemainingMove(match);
  const isGameOver = arrMoves.every((move) => move === false);

  if (
    (remainingCards.length === 0 && isGameOver) ||
    remainingPlayers.length < 2
  ) {
    await processGameResult(
      matchID,
      remainingPlayers.includes("user") ? "lose" : "win"
    );

    return true;
  }

  return false;
};
