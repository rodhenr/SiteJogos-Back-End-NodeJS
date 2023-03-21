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

  return { ...userInfo, level: Number(level.level) };
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
