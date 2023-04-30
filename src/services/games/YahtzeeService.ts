import db from "../../models";

import { createErrorObject } from "./generalService";

import { IMatchYahtzeeWithMatch } from "../../interfaces/InfoInterface";

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
    id: match.id,
    matchID: matchID,
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

export const singlePoints = (dices: number[], rule: number) => {
  let score = 0;

  dices.forEach((i) => {
    if (i === rule) score += rule;
  });

  return score;
};

export const sameDices = (dices: number[], rule: number) => {
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

export const inARow = (dices: number[], rule: number) => {
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

export const sumDices = (dices: number[]) => {
  let score = 0;

  dices.forEach((item) => {
    score += item;
  });

  return score;
};
