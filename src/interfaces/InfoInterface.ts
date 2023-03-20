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
