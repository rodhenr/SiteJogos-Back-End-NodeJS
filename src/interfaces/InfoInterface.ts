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
