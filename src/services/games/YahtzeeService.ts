import db from "../../models";

import { createErrorObject } from "./generalService";

import {
  IMatchProcessingWithResult,
  IMatchYahtzeeWithMatch,
} from "../../interfaces/InfoInterface";

type sameKind = {
  [key: string]: number;
};

export const getYahtzeeInicialData = async (matchID: number) => {
  const match: IMatchYahtzeeWithMatch = await db.Match_Yahtzee.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  return {
    matchID: matchID,
    isGameOver: false,
    gameResult: null,
    points: null,
    remainingMoves: match.remainingMoves,
    currentDices: JSON.parse(match.currentDices),
    ruleSum_all: match.ruleSum_all,
    ruleSum_one: match.ruleSum_one,
    ruleSum_two: match.ruleSum_two,
    ruleSum_three: match.ruleSum_three,
    ruleSum_four: match.ruleSum_four,
    ruleSum_five: match.ruleSum_five,
    ruleSum_six: match.ruleSum_six,
    ruleSame_three: match.ruleSame_three,
    ruleSame_four: match.ruleSame_four,
    rule_yahtzee: match.rule_yahtzee,
    ruleRow_four: match.ruleRow_four,
    ruleRow_five: match.ruleRow_five,
  };
};

export const handleRollDice = async (matchID: number, dices: string) => {
  try {
    const match: IMatchYahtzeeWithMatch = await db.Match_Yahtzee.findOne({
      include: [{ model: db.Match }],
      where: { matchID },
      raw: true,
    });

    if (!match) throw createErrorObject("Partida não encontrada.", 400);

    if (match.remainingMoves === 0)
      throw createErrorObject(
        "Não é mais possível jogar os dados nesse turno.",
        400
      );

    const dicesRequest: boolean[] = JSON.parse(dices);
    const currentDices: number[] = JSON.parse(match.currentDices);

    if (currentDices.length !== 5)
      throw createErrorObject(
        "Número incorreto de valores no parâmetro 'dados'.",
        400
      );

    console.log(currentDices);
    for (let i = 0; i < 5; i++) {
      const randDice: number = Math.ceil(Math.random() * 6);

      if (dicesRequest[i] === false) {
        currentDices[i] = randDice;
      }
    }

    await db.Match_Yahtzee.update(
      {
        remainingMoves: match.remainingMoves - 1,
        currentDices: JSON.stringify(currentDices),
      },
      { where: { matchID } }
    );
  } catch (err: any) {
    console.log(err);
  }
};

export const getYahtzeeGameState = async (matchID: number) => {
  const data: IMatchYahtzeeWithMatch = await db.Match_Yahtzee.findOne({
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
    matchID: matchID,
    isGameOver: dataMatchOver ? true : false,
    gameResult: dataMatchOver ? dataMatchOver["Config_Result.result"] : null,
    points: null,
    remainingMoves: data.remainingMoves,
    currentDices: JSON.parse(data.currentDices),
    ruleSum_all: data.ruleSum_all,
    ruleSum_one: data.ruleSum_one,
    ruleSum_two: data.ruleSum_two,
    ruleSum_three: data.ruleSum_three,
    ruleSum_four: data.ruleSum_four,
    ruleSum_five: data.ruleSum_five,
    ruleSum_six: data.ruleSum_six,
    ruleSame_three: data.ruleSame_three,
    ruleSame_four: data.ruleSame_four,
    rule_yahtzee: data.rule_yahtzee,
    ruleRow_four: data.ruleRow_four,
    ruleRow_five: data.ruleRow_five,
  };
};

export const useYahtzeeRule = async(matchID: number, ruleName: string) => {
  
}

const singlePoints = (dices: number[], rule: number) => {
  let score = 0;

  dices.forEach((i) => {
    if (i === rule) score += rule;
  });

  return score;
};

const sameDices = (dices: number[], rule: number) => {
  let score = 0;
  let count: sameKind = {};

  for (const el of dices) {
    count[el] ? (count[el] += 1) : (count[el] = 1);
  }

  Object.values(count).forEach((i) => {
    if (i >= rule) {
      if (rule === 5) {
        score = 50;
      } else {
        dices.forEach((item) => {
          score += item;
        });
      }
    }
  });

  return score;
};

const inARow = (dices: number[], rule: number) => {
  let score = 0;
  let count: sameKind = {};

  for (const el of dices) {
    count[el] ? (count[el] += 1) : (count[el] = 1);
  }

  if (rule === 4) {
    if (
      (count[1] && count[2] && count[3] && count[4]) ||
      (count[2] && count[3] && count[4] && count[5]) ||
      (count[3] && count[4] && count[5] && count[6])
    ) {
      score = 30;
    }
  } else {
    if (
      (count[1] && count[2] && count[3] && count[4] && count[5]) ||
      (count[2] && count[3] && count[4] && count[5] && count[6])
    ) {
      score = 40;
    }
  }

  return score;
};

const sumDices = (dices: number[]) => {
  let score = 0;

  dices.forEach((item) => {
    score += item;
  });

  return score;
};
