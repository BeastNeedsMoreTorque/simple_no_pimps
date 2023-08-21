import _ from 'lodash/fp';

export const calculateStandings = (matches) => {
  // Use Lodash/fp to create an object with team names as keys
  // and the initial values for points, goalsFor, goalsAgainst
  const initialStandings = _.reduce(
    (result, match) => {
      return _.flow(
        _.set([match.homeTeam], {
          team: match.homeTeam,
          gp: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          pointsArray: [],
          form: [],
        }),
        _.set([match.awayTeam], {
          team: match.awayTeam,
          gp: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
          pointsArray: [],
          form: [],
        })
      )(result);
    },
    {},
    matches
  );

  // Use Lodash/fp to iterate over the matches and update the standings
  //updatedStandings doesnt quite work in this form
  const updatedStandings = (result, match) => {
    const updateTeam = (
      team,
      pointsHome,
      pointsAway,
      outcome,
      goalHome,
      goalAway
    ) => {
      const points =
        outcome === 'HOME_TEAM'
          ? pointsHome
          : outcome === 'AWAY_TEAM'
          ? pointsAway
          : 1;
      const wins = outcome === 'HOME_TEAM' ? 1 : 0;
      const draws = outcome === 'DRAW' ? 1 : 0;
      const losses = outcome === 'AWAY_TEAM' ? 1 : 0;
      const form =
        outcome === 'HOME_TEAM' ? 'w' : outcome === 'DRAW' ? 'd' : 'l';

      return _.flow(
        _.set(
          'crest',
          outcome === 'HOME_TEAM' ? match.crestHome : match.crestAway
        ),
        _.set('points', team.points + points),
        _.set('pointsArray', [...team.pointsArray, team.points + points]),
        _.set('wins', team.wins + wins),
        _.set('draws', team.draws + draws),
        _.set('losses', team.losses + losses),
        _.set('form', [...team.form, form]),
        _.set('goalsFor', team.goalsFor + goalHome),
        _.set('goalsAgainst', team.goalsAgainst + goalAway),
        _.set('gp', team.gp + 1)
      )(team);
    };

    const homeTeam = result[match.homeTeam];
    const awayTeam = result[match.awayTeam];

    const updatedHomeTeam = updateTeam(
      homeTeam,
      3,
      0,
      match.outcome,
      match.homeScore,
      match.awayScore
    );

    const updatedAwayTeam = updateTeam(
      awayTeam,
      0,
      3,
      match.outcome === 'HOME_TEAM'
        ? 'AWAY_TEAM'
        : match.outcome === 'AWAY_TEAM'
        ? 'HOME_TEAM'
        : 'DRAW',
      match.awayScore,
      match.homeScore
    );

    return {
      ...result,
      [match.homeTeam]: updatedHomeTeam,
      [match.awayTeam]: updatedAwayTeam,
    };
  };
  console.log('intialStandings', initialStandings);
  // Use Lodash/fp to convert the object to an array and sort by points
  const sortedStandings = _.flow(
    _.values,
    _.sortBy('points'),
    _.reverse
  )(updatedStandings);
  return sortedStandings;
};
