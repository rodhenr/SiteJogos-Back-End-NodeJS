export interface IUser {
  id: number;
  name: string;
  password: string;
  experience: number;
  avatar: "";
}

export interface IExperience {
  id: number;
  level: number;
  experience_accumulated: number;
}

export interface IRecentMatches {
  id: number;
  date: Date;
  is_win: boolean;
  is_processed: boolean;
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