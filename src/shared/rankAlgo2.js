const _ = require('lodash/fp');

export const teamStats = (gameResults) => {
  const pushResult = (resultArray, isWin, isDraw) => {
    if (isWin) {
      resultArray.push('w');
    } else if (isDraw) {
      resultArray.push('d');
    } else {
      resultArray.push('l');
    }
  };

  const getTeamStatsWithResults = (results) => {
    const teams = _.keys(results);
    return _.map((team) => {
      const teamStats = results[team];
      const games = teamStats.games;
      const resultArray = [];
      _.forEach(({ winner, draw }) => {
        pushResult(resultArray, winner, draw);
      }, games);
      return { ...teamStats, results: resultArray };
    }, teams);
  };

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

  return _.keyBy('team', getTeamStatsWithResults(stats));
};

