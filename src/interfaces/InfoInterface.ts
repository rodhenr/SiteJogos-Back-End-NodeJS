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
