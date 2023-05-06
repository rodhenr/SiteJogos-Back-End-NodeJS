import db from "../../models";

import { createErrorObject, processGameResult } from "./generalService";

import {
  IConfig_Result,
  IMatchProcessingWithResult,
  IMatchYahtzeeWithMatch,
  IYahtzeeRules,
  IYahtzeeRulesObject,
} from "../../interfaces/interfaces";

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

export const handleRollDice = async (matchID: number, dices: boolean[]) => {
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

    const currentDices: number[] = JSON.parse(match.currentDices);

    if (currentDices.length !== 5)
      throw createErrorObject(
        "Número incorreto de valores no parâmetro 'dados'.",
        400
      );

    for (let i = 0; i < 5; i++) {
      const randDice: number = Math.ceil(Math.random() * 6);

      if (dices[i] === false) {
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
    currentDices: JSON.parse(data.currentDices),
    isGameOver: dataMatchOver ? true : false,
    gameResult: dataMatchOver ? dataMatchOver["Config_Result.result"] : null,
    matchID: matchID,
    points: null,
    remainingMoves: data.remainingMoves,
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

export const useYahtzeeRule = async (matchID: number, ruleName: string) => {
  const match: IMatchYahtzeeWithMatch = await db.Match_Yahtzee.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  if (!match) throw createErrorObject("Partida não encontrada.", 400);

  const rulesObject: IYahtzeeRulesObject = {
    ruleSum_all: { value: 0, method: handleRule_sumAll },
    ruleSum_one: { value: 1, method: handleRule_sum },
    ruleSum_two: { value: 2, method: handleRule_sum },
    ruleSum_three: { value: 3, method: handleRule_sum },
    ruleSum_four: { value: 4, method: handleRule_sum },
    ruleSum_five: { value: 5, method: handleRule_sum },
    ruleSum_six: { value: 6, method: handleRule_sum },
    ruleSame_three: { value: 3, method: handleRule_same },
    ruleSame_four: { value: 4, method: handleRule_same },
    rule_yahtzee: { value: 0, method: () => 1 },
    ruleRow_four: { value: 4, method: handleRule_row },
    ruleRow_five: { value: 5, method: handleRule_row },
  };

  if (
    !Object.keys(rulesObject).includes(ruleName) ||
    !Object.keys(match).includes(ruleName)
  )
    throw createErrorObject("Regra não encontrada.", 400);

  if (match[ruleName as keyof IYahtzeeRules] !== null)
    throw createErrorObject("Você já pontuou para essa regra.", 400);

  const dices = JSON.parse(match.currentDices);
  const rule = rulesObject[ruleName as keyof IYahtzeeRules];
  const score = rule.method(dices, rule.value);

  await updateUserPoints(matchID, ruleName, score);
};

const updateUserPoints = async (
  matchID: number,
  ruleName: string,
  points: number
) => {
  const dices: number[] = [];

  for (let i = 0; i < 5; i++) {
    const randDice: number = Math.ceil(Math.random() * 5);
    dices.push(randDice);
  }

  await db.Match_Yahtzee.update(
    {
      remainingMoves: 2,
      [ruleName]: points,
      currentDices: JSON.stringify(dices),
    },
    { where: { matchID } }
  );
};

const handleRule_sumAll = (dices: number[], ruleParam: number) => {
  let score = 0;

  dices.forEach((dice) => {
    score += dice;
  });

  return score;
};

const handleRule_sum = (dices: number[], ruleParam: number) => {
  let score = 0;

  dices.forEach((dice) => {
    if (dice === ruleParam) score += ruleParam;
  });

  return score;
};

const handleRule_same = (dices: number[], ruleParam: number) => {
  let score = 0;
  let count: sameKind = {};

  for (const dice of dices) {
    count[dice] ? (count[dice] += 1) : (count[dice] = 1);
  }

  Object.values(count).forEach((value) => {
    if (value >= ruleParam) {
      if (ruleParam === 5) {
        score = 50;
      } else {
        dices.forEach((dice) => {
          score += dice;
        });
      }
    }
  });

  return score;
};

const handleRule_row = (dices: number[], ruleParam: number) => {
  let score = 0;
  let count: sameKind = {};

  for (const dice of dices) {
    count[dice] ? (count[dice] += 1) : (count[dice] = 1);
  }

  if (ruleParam === 4) {
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

export const checkYahtzeeGameOver = async (matchID: number) => {
  const match: IMatchYahtzeeWithMatch = await db.Match_Yahtzee.findOne({
    include: [{ model: db.Match }],
    where: { matchID },
    raw: true,
  });

  const resultTypes: IConfig_Result[] = await db.Config_Result.findAll({
    raw: true,
  });

  const rules: (number | null)[] = [
    match.ruleSum_all,
    match.ruleSum_one,
    match.ruleSum_two,
    match.ruleSum_three,
    match.ruleSum_four,
    match.ruleSum_five,
    match.ruleSum_six,
    match.ruleSame_three,
    match.ruleSame_four,
    match.rule_yahtzee,
    match.ruleRow_four,
    match.ruleRow_five,
  ];

  const isGameOver: boolean = rules.every((rule) => rule !== null);

  if (isGameOver) {
    const points = rules.reduce((acc, cur) => acc! + cur!);
    const result: string = points! > 150 ? "win" : "lose";
    const gameResult: IConfig_Result[] = resultTypes.filter(
      (r: IConfig_Result) => {
        return r.result === result;
      }
    );

    await processGameResult(matchID, result);

    await db.Match_Yahtzee.update(
      {
        isGameOver: true,
        gameResult: gameResult[0].result,
        points,
      },
      { where: { matchID } }
    );
  }
};
