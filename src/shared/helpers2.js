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
  const updatedStandings = _.reduce(
    (result, match) => {
      if (match.outcome === 'HOME_TEAM') {
        result[match.homeTeam].points += 3;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].wins += 1;
        result[match.homeTeam].form.push('w');
        result[match.awayTeam].points += 0;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].losses += 1;
        result[match.awayTeam].form.push('l');
      } else if (match.outcome === 'DRAW') {
        result[match.homeTeam].points += 1;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].draws += 1;
        result[match.homeTeam].form.push('d');
        result[match.awayTeam].points += 1;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].draws += 1;
        result[match.awayTeam].form.push('d');
      } else if (match.outcome === 'AWAY_TEAM') {
        result[match.homeTeam].points += 0;
        result[match.homeTeam].pointsArray.push(result[match.homeTeam].points);
        result[match.homeTeam].losses += 1;
        result[match.homeTeam].form.push('l');
        result[match.awayTeam].points += 3;
        result[match.awayTeam].pointsArray.push(result[match.awayTeam].points);
        result[match.awayTeam].wins += 1;
        result[match.awayTeam].form.push('w');
      }
      result[match.homeTeam].goalsFor += match.homeGoals;
      result[match.homeTeam].goalsAgainst += match.awayGoals;
      result[match.homeTeam].gp += 1;
      result[match.awayTeam].goalsFor += match.awayGoals;
      result[match.awayTeam].goalsAgainst += match.homeGoals;
      result[match.awayTeam].gp += 1;
      return result;
    },
    initialStandings,
    matches
  );
    console.log('intialStandings', initialStandings);
  // Use Lodash/fp to convert the object to an array and sort by points
  const sortedStandings = _.flow(
    _.values,
    _.sortBy('points'),
    _.reverse
  )(updatedStandings);
  return sortedStandings;
};
