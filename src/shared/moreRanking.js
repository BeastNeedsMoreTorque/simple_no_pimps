const _ = require('lodash/fp');

// Sample game results data
/*
const gameResults = [
  {
    date: '2022-04-01',
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    homeScore: 2,
    awayScore: 1,
  },
  {
    date: '2022-04-02',
    homeTeam: 'Team C',
    awayTeam: 'Team D',
    homeScore: 1,
    awayScore: 1,
  },
  {
    date: '2022-04-03',
    homeTeam: 'Team E',
    awayTeam: 'Team F',
    homeScore: 0,
    awayScore: 2,
  },
  // ... more game results data
];
*/

// Helper functions for calculating team statistics
const getTeamStats = _.flow(
  _.groupBy('team'),
  _.mapValues((games) => {
    const wins = _.filter({ winner: true }, games).length;
    const draws = _.filter({ draw: true }, games).length;
    const losses = games.length - wins - draws;
    const goalsFor = _.sumBy('teamScore', games);
    const goalsAgainst = _.sumBy('opponentScore', games);
    const goalDiff = goalsFor - goalsAgainst;
    const points = wins * 3 + draws;
    // const formArray = _.flow(_.filter({winner: true}), );
    return {
      games: games.length,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDiff,
      points,
      // formArray,
    };
  })
);

// Calculate team statistics from game results data

/*
const teamStats = getTeamStats(
  _.flatMap(
    ({ date, homeTeam, awayTeam, homeScore, awayScore }) => [
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
        draw: homeScore === awayScore,
      },
    ],
    gameResults
  )
);
*/



const teamStats = (gameResults) => {
  const stats = getTeamStats(
    _.flatMap(
      ({ date, homeTeam, awayTeam, homeScore, awayScore }) => [
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
          draw: homeScore === awayScore,
        },
      ],
      gameResults
    )
  );
  return stats;
};

/*
        d: m.id,
        name: m.stage,
        awayTeam: m.awayTeam.name,
        homeTeam: m.homeTeam.name,
        status: m.status,
        outcome: m.score.winner,
        //dataDay: dataDay,
        //time: time,
        awayGoals: m.score.fullTime.awayTeam,
        homeGoals: m.score.fullTime.homeTeam,
*/


// Calculate team rank from team statistics
const teamRank = _.flow(
  _.toPairs,
  _.orderBy(
    [([_, stats]) => stats.points, ([team, _]) => team],
    ['desc', 'asc']
  ),
  _.zipWith(_.set([1, 'rank'], 1), _.range(1, _.size(teamStats) + 1)),
  _.fromPairs
)(teamStats);

// Calculate team rank change from previous rank
const prevTeamRank = {}; // Replace with previous team rank data
const teamRankChange = _.mapValues((stats, team) => {
  const prevRank = prevTeamRank[team]?.rank;
  return prevRank ? prevRank - stats.rank : 0;
}, teamRank);

// Construct the football standings table with rank change column
export const myStandingsTable = (gameResults) => {
const standingsTable = _.flow(
  _.toPairs,
  _.map(([team, stats]) => ({
    team,
    ...stats,
    rankChange: teamRankChange[team],
  })),
  _.orderBy('points', 'desc')
)(teamStats(gameResults));
return standingsTable
}
//to run in node cli
//console.log(myStandingsTable(gameResults));
