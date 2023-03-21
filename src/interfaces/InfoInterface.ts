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
