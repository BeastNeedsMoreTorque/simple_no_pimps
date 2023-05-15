const _ = require('lodash/fp');

export const teamForm = (gameResults) => {
  const pushResult = _.curry((resultArray, isWin, isDraw) => {
    const result = isWin ? 'w' : isDraw ? 'd' : 'l';
    return _.concat(resultArray, result);
  });

  const getTeamStatsWithResults = _.flow(
    _.mapValues.convert({ cap: false })((teamForm) => {
      const games = teamForm.games;
      const resultArray = _.reduce(
        (acc, { winner, draw }) => {
          return pushResult(acc, winner, draw);
        },
        [],
        games
      );
      return _.set('results', resultArray, teamForm);
    }),
    _.keyBy('team')
  );

  const stats = getTeamStats(
    _.flatMap(
      ({ homeTeam, awayTeam, homeScore, awayScore }) => [
        {
          team: homeTeam,
          teamScore: homeScore,
          opponentScore: awayScore,
          winner: homeScore > awayScore,
          draw: homeScore === awayScore,
        },
        {
          team: awayTeam,
          teamScore: awayScore,
          opponentScore: homeScore,
          winner: awayScore > homeScore,
          draw: awayScore === homeScore,
        },
      ],
      gameResults
    )
  );

  return getTeamStatsWithResults(stats);
};
