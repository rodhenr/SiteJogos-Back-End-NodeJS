import { Sequelize } from "sequelize";

export interface ISequelizeDB {
  sequelize: Sequelize;
  Sequelize: any;
  [key: string]: any;
}

export interface IUser {
  id: number;
  name: string;
  user: string;
  password: string;
  experience: number;
  avatar: "";
}

export interface IGame {
  id: number;
  name: string;
  win_points: number;
  draw_points: number;
  lose_points: number;
}

export interface IUserSafe {
  id: number;
  name: string;
  user: string;
  experience: number;
  avatar: "";
}

export interface IExperience {
  id: number;
  level: number;
  experience_accumulated: number;
}

export interface IMatch {
  id: number;
  userID: number;
  gameID: number;
  date: Date;
  matchProcessingID: number;
}

export interface ICreateMatch {
  dataValues: IMatch;
}

export interface IUserMatches {
  id: number;
  date: Date;
  userID: string;
  "Game.name": string;
  "MatchProcessing.id": number;
  "MatchProcessing.matchID": number;
  "MatchProcessing.date": Date;
  "MatchProcessing.resultID": number;
  "MatchProcessing.Config_Result.id": number;
  "MatchProcessing.Config_Result.result": string;
}

export interface IRecentMatches extends IUserMatches {
  "User.name": string;
}

interface IStatistics {
  game: string;
  wins: number;
  loses: number;
}

export interface IUserInfo {
  playerID: number | null;
  playerName: string | null;
  playerAvatar: string | null;
  statistics: IStatistics[] | [];
  ranking: number | null;
  level: number | null;
}

export interface IJWTDecoded {
  name: string;
  user: string;
}

export interface IGameStats {
  game: string;
  wins: number;
  loses: number;
  draws: number;
}

export interface IUserFriends {
  avatar: string;
  id: number;
  name: string;
}

export interface IGamePlayerInfo {
  userID: string;
  username: string;
  wins: number;
}

export interface IMatchesGroup {
  id: number;
  name: string;
  totalWins: number;
  "User.id": number;
  "User.name": string;
  "Game.id": number;
  "Game.name": string;
}

export interface IMatchTicTacToeWithMatch {
  "Match.id": number;
  "Match.date": Date;
  "Match.userID": number;
  "Match.gameID": number;
  "Match.matchProcessingID": number;
  id: number;
  matchID: number;
  isUserMove: boolean;
  isUserCell_1: boolean;
  isUserCell_2: boolean;
  isUserCell_3: boolean;
  isUserCell_4: boolean;
  isUserCell_5: boolean;
  isUserCell_6: boolean;
  isUserCell_7: boolean;
  isUserCell_8: boolean;
  isUserCell_9: boolean;
}

export interface IMatchTicTacToeCells {
  isUserCell_1: boolean;
  isUserCell_2: boolean;
  isUserCell_3: boolean;
  isUserCell_4: boolean;
  isUserCell_5: boolean;
  isUserCell_6: boolean;
  isUserCell_7: boolean;
  isUserCell_8: boolean;
  isUserCell_9: boolean;
}

export interface IMatchTicTacToe extends IMatchTicTacToeCells {
  id: number;
  matchID: number;
  isUserMove: boolean;
}

export interface IMatchJokenpoWithMatch {
  "Match.id": number;
  "Match.date": Date;
  "Match.userID": number;
  "Match.gameID": number;
  "Match.matchProcessingID": number;
  id: number;
  matchID: number;
  userChoiceID: number;
  cpuChoiceID: number;
}

export interface IJokenpoChoice {
  id: number;
  choice: string;
}

export interface IJokenpoResultWithConfigResult {
  userChoiceID: number;
  cpuChoiceID: number;
  resultID: number;
  "Config_Result.id": number;
  "Config_Result.result": string;
}

export interface IMatchProcessing {
  id: number;
  matchID: number;
  date: Date;
  resultID: boolean;
}

export interface IConfig_Result {
  id: number;
  result: string;
}

export interface IPossiblePoints {
  lose_points: number;
  win_points: number;
  draw_points: number;
}

export interface IMatchUno {
  id: number;
  matchID: number;
  isClockwise: boolean;
  nextPlayer: string;
  remainingCards: string;
  remainingPlayers: string;
  gameHistory: null | string;
  lastCard: null | string;
  currentColor: null | string;
  turn: null | number;
  userCards: string;
  cpu1Cards: string;
  cpu2Cards: string;
  cpu3Cards: string;
}

export interface IMatchUnoWithMatch extends IMatchUno {
  "Match.id": number;
  "Match.date": Date;
  "Match.userID": number;
  "Match.gameID": number;
  "Match.matchProcessingID": number;
}

export interface IConfigUnoCards {
  id: number;
  card: string;
  color: string | null;
  value: number | null;
  is_num: boolean;
  is_block: boolean;
  is_reverse: boolean;
  is_plusTwo: boolean;
  is_plusFour: boolean;
  is_changeColor: boolean;
}

export interface ICardsObj {
  userCards: string[];
  cpu1Cards: string[];
  cpu2Cards: string[];
  cpu3Cards: string[];
}

export interface IMatchProcessingWithResult {
  id: number;
  matchID: number;
  date: Date;
  resultID: number;
  "Config_Result.id": number;
  "Config_Result.result": string;
}

export interface IUnoMatchState {
  color: string | null;
  cpu1CardsLength: number;
  cpu2CardsLength: number;
  cpu3CardsLength: number;
  isClockwise: boolean;
  isGameOver: boolean;
  gameResult: string | null;
  lastCard: string | null;
  matchID: number;
  nextPlayer: string | null;
  remainingCardsLength: number | null;
  remainingPlayers: string;
  userCards: string;
  turn: number | null;
}

export interface IMatchYahtzee {
  id: number;
  matchID: number;
  remainingMoves: number;
  currentDices: string;
  ruleSum_all: number | null;
  ruleSum_one: number | null;
  ruleSum_two: number | null;
  ruleSum_three: number | null;
  ruleSum_four: number | null;
  ruleSum_five: number | null;
  ruleSum_six: number | null;
  ruleSame_three: number | null;
  ruleSame_four: number | null;
  rule_yahtzee: number | null;
  ruleRow_four: number | null;
  ruleRow_five: number | null;
}

export interface IMatchYahtzeeWithMatch extends IMatchYahtzee {
  "Match.id": number;
  "Match.date": Date;
  "Match.userID": number;
  "Match.gameID": number;
  "Match.matchProcessingID": number;
}

export interface IMatchYahtzeeState {
  currentDices: number[];
  isGameOver: boolean;
  gameResult: string | null;
  matchID: number;
  points: number | null;
  remainingMoves: number;
  ruleSum_all: number | null;
  ruleSum_one: number | null;
  ruleSum_two: number | null;
  ruleSum_three: number | null;
  ruleSum_four: number | null;
  ruleSum_five: number | null;
  ruleSum_six: number | null;
  ruleSame_three: number | null;
  ruleSame_four: number | null;
  rule_yahtzee: number | null;
  ruleRow_four: number | null;
  ruleRow_five: number | null;
}

export interface IYahtzeeObject {
  value: number;
  method: (dices: number[], ruleParam: number) => number;
}

export interface IYahtzeeRulesObject {
  ruleSum_all: IYahtzeeObject;
  ruleSum_one: IYahtzeeObject;
  ruleSum_two: IYahtzeeObject;
  ruleSum_three: IYahtzeeObject;
  ruleSum_four: IYahtzeeObject;
  ruleSum_five: IYahtzeeObject;
  ruleSum_six: IYahtzeeObject;
  ruleSame_three: IYahtzeeObject;
  ruleSame_four: IYahtzeeObject;
  rule_yahtzee: IYahtzeeObject;
  ruleRow_four: IYahtzeeObject;
  ruleRow_five: IYahtzeeObject;
}

export interface IYahtzeeRules {
  ruleSum_all: number | null;
  ruleSum_one: number | null;
  ruleSum_two: number | null;
  ruleSum_three: number | null;
  ruleSum_four: number | null;
  ruleSum_five: number | null;
  ruleSum_six: number | null;
  ruleSame_three: number | null;
  ruleSame_four: number | null;
  rule_yahtzee: number | null;
  ruleRow_four: number | null;
  ruleRow_five: number | null;
}
