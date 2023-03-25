import { IExperience, IUser } from "../interfaces/InfoInterface";
import db from "../models";

export const getUniquePlayerLevel = (
  experienceList: IExperience[],
  userInfo: IUser
) => {
  const level = experienceList
    .filter((lvl) => {
      return Number(lvl.experience_accumulated) <= Number(userInfo.experience);
    })
    .at(-1);

  if (!level)
    throw Error(
      "Algo de errado aconteceu na sua requisição. Contate o suporte técnico."
    );

  const nextLevel = experienceList
    .filter((lvl) => {
      return lvl.level === Number(level.level) + 1;
    })
    .at(-1);

  if (!nextLevel)
    throw Error(
      "Algo de errado aconteceu na sua requisição. Contate o suporte técnico."
    );

  return {
    avatar: userInfo.avatar,
    id: userInfo.id,
    name: userInfo.name,
    experience: userInfo.experience,
    level: Number(level.level),
    maxExperience: nextLevel.experience_accumulated,
  };
};

export const getPlayerLevelByList = async (userInfo: IUser[]) => {
  const experienceList: IExperience[] = await db.Experience.findAll({
    raw: true,
  });

  const userListWithLevel = userInfo.map((user) => {
    return getUniquePlayerLevel(experienceList, user);
  });

  return userListWithLevel;
};
