export interface IUser {
  id: number;
  name: string;
  user: string;
  password: string;
  experience: number;
  avatar: "";
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
  date: Date;
  is_win: boolean;
  userID: string;
  "User.name": string;
  "Game.name": string;
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
}

export interface IUserFriends {
  avatar: string;
  id: number;
  name: string;
}

interface IMatchRecords {
  gameName: string;
  userName: string;
  userID: number;
  totalWins: number;
}

export interface IGames {
  [key: string]: IMatchRecords[];
}

export interface IGamePlayerInfo {
  userID: string;
  username: string;
  wins: number;
}

export interface IGameListByPlayer {
  [key: string]: IMatchRecords[];
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

export interface IMatchTicTacToeIncluded {
  id: number;
  date: Date;
  userID: number;
  gameID: number;
  is_win: boolean;
  is_processed: boolean;
  "Match_TicTacToe.id": number;
  "Match_TicTacToe.matchID": number;
  "Match_TicTacToe.isUserMove": boolean;
  "Match_TicTacToe.isUserCell_1": boolean;
  "Match_TicTacToe.isUserCell_2": boolean;
  "Match_TicTacToe.isUserCell_3": boolean;
  "Match_TicTacToe.isUserCell_4": boolean;
  "Match_TicTacToe.isUserCell_5": boolean;
  "Match_TicTacToe.isUserCell_6": boolean;
  "Match_TicTacToe.isUserCell_7": boolean;
  "Match_TicTacToe.isUserCell_8": boolean;
  "Match_TicTacToe.isUserCell_9": boolean;
}

export interface IMatchTicTacToe {
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
