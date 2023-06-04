import { flow, set, reduce, values, sortBy, reverse } from 'lodash/fp';

export const calculateStandings = (matches) => {
  const initialStandings = reduce(
    (result, match) => {
      const createTeam = () => ({
        team: match.homeTeam,
        crest: '',
        gp: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        pointsArray: [],
        form: [],
      });

      return flow(
        set([match.homeTeam], createTeam()),
        set([match.awayTeam], createTeam())
      )(result);
    },
    {},
    matches
  );

  const updateStandings = (result, match) => {
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

      return flow(
        set(
          'crest',
          outcome === 'HOME_TEAM' ? match.crestHome : match.crestAway
        ),
        set('points', team.points + points),
        set('pointsArray', [...team.pointsArray, team.points + points]),
        set('wins', team.wins + wins),
        set('draws', team.draws + draws),
        set('losses', team.losses + losses),
        set('form', [...team.form, form]),
        set('goalsFor', team.goalsFor + goalHome),
        set('goalsAgainst', team.goalsAgainst + goalAway),
        set('gp', team.gp + 1)
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

  const updatedStandings = reduce(updateStandings, initialStandings, matches);

  const sortedStandings = flow(
    values,
    sortBy('points'),
    reverse
  )(updatedStandings);

  return sortedStandings;
};
