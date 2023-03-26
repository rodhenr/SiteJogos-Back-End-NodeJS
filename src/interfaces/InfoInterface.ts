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
