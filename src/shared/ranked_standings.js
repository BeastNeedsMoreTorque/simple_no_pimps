//import { flow, cloneDeep, sortBy, reduce } from 'lodash/fp';

/*
export const rankStandings = flow(
  cloneDeep,
  sortBy('points'),
  reduce(
    (acc, team, index) => {
      const rankChange =
        acc.prevPoints === team.points ? acc.rankChange : index + 1 - acc.rank;
      return {
        standings: [...acc.standings, { ...team, rank: index + 1, rankChange }],
        prevPoints: team.points,
        rank: index + 1,
        rankChange,
      };
    },
    { standings: [], prevPoints: null, rank: null, rankChange: null }
  ),
  (result) => result.standings
);

//const rankedStandings = standings => rankStandings(standings);
//return rankedStandings;
*/
//const [previousPoints] = pointsArray.at(-2);
//const [currentPoints] = pointsArray.at(-1)


//better version
import { flow, cloneDeep, sortBy, reduce } from 'lodash/fp';

export const rankStandings = (sortedStandings) => {
  const standings = flow(
    cloneDeep,
    sortBy('points'),
    reduce(
      (acc, team, index) => {
        const rankChange =
          acc.prevPoints === team.points
            ? acc.rankChange
            : index + 1 - acc.rank;
        return {
          standings: [
            ...acc.standings,
            { ...team, rank: index + 1, rankChange },
          ],
          prevPoints: team.points,
          rank: index + 1,
          rankChange,
        };
      },
      { standings: [], prevPoints: null, rank: null, rankChange: null }
    ),
    (result) => result.standings
  )(sortedStandings);
  // console.log("rank: ",standings.rank);
  return standings;
};


