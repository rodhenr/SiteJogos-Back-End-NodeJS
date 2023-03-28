import { getMatchesList } from "./matchService";

import { IGameListByPlayer, IGames } from "../interfaces/InfoInterface";

export const getRecordsList = async () => {
  const matchesList = await getMatchesList(0);

  const gamesList: IGames = {};

  if (matchesList.length > 0) {
    for (const match of matchesList) {
      const gameIndex = Object.keys(gamesList).findIndex((game) => {
        return game === match["Game.name"];
      });

      const gameName = match["Game.name"];

      if (gameIndex === -1) {
        gamesList[gameName] = [{ ...match }];
      } else {
        gamesList[gameName].push({ ...match });
      }
    }
  }

 

  return [];
};
