import React, { useState, useEffect } from 'react';
import './FootballStandingsTable.css';

const FootballStandingsTable = () => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    // fetch football standings data from an API or other data source
    // and set it in the state using setStandings
    const fetchData = async () => {
      const response = await fetch(
        'https://api.example.com/football/standings'
      );
      const data = await response.json();
      setStandings(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    // compute the rank of each team based on their points
    const sortedStandings = [...standings].sort((a, b) => b.points - a.points);
    const rankedStandings = sortedStandings.reduce(
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
    ).standings;
    setStandings(rankedStandings);
  }, [standings]);

  return (
    <table className='football-standings-table'>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Points</th>
          <th>Rank Change</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team) => (
          <tr key={team.id}>
            <td>{team.rank}</td>
            <td>{team.name}</td>
            <td>{team.points}</td>
            <td>
              {team.rankChange !== null
                ? team.rankChange > 0
                  ? `+${team.rankChange}`
                  : team.rankChange < 0
                  ? 'minus'
                  : ' '
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

//<td>{team.rankChange !== null ? (team.rankChange > 0 ? `+${team.rankChange}` : team.rankChange) : '-'}</td>
export default FootballStandingsTable;
