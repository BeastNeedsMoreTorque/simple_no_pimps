import React, {useState, useEffect} from 'react'
import './App.css';
import axios from 'axios'

import _ from 'lodash';
import pimps from './shared/pimps_long.json';
import {calculateStandings} from './shared/helpers2'
import {rankStandings} from './shared/ranked_standings'
import {myStandingsTable} from './shared/moreRanking'
import {Loader} from './shared/Loader'

const options = {
  method: 'GET',
  headers: {
    'X-Auth-Token': '6514a50db6064d86a774da3072668946',
  },
};
const BASE_URL = 'https://api.football-data.org/v2/';



function App() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true)
    // Fetch matches from the API
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}competitions/2021/matches`,
          options
        );
        const results = response.data.matches.filter(
          (p) =>
            !pimps.includes(p.homeTeam.name) && !pimps.includes(p.awayTeam.name)
        );
        setMatches(results);
        setIsLoading(false)
      } catch (error) {
        console.error(error);
      }
    };

    fetchMatches();
  }, []);

  function gameStatus(x) {
    return x === 'FINISHED';
  }

  // console.log("matches: ", matches);

  //format results data for processing/calculating
  const finishedGames = matches
    .filter((r) => gameStatus(r.status))
    .map((m) =>
      //let dataDayCommon = m.utcDate.split('T');
      //let dataDay = dataDayCommon[0].split('-').reverse().join('-');
      //let time = dataDayCommon[1].slice(0, -4);
      ({
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
      })
    );

    // console.log("finishedGames: ", finishedGames);

  // setStandings(calculateStandings(finishedGames))
  //const tableStandings = calculateStandings(finishedGames)
  const tableStandings = myStandingsTable(finishedGames)
  // console.log("tableStandings: ", JSON.stringify(tableStandings,null,2))
  
  // console.log("rankStandings: ", JSON.stringify(rankStandings(tableStandings), null,2));

  return (
    <div className='App container mx-auto max-w-screen-xl px-2'>
      <h2 className='"text-2xl w-full" px-2 pt-8 pb-8 text-center font-extrabold md:text-4xl lg:text-5xl'>
        EPL - English Pimp-Less League
      </h2>
      {isLoading ? (
        <Loader />
      ) : (
        <table className='w-full text-base'>
          <thead className='border-b'>
            <tr className='text-left'>
              <th>Position</th>
              <th className='team-header'>Team</th>
              <th className='p-1 pb-2 text-center'>GP</th>
              <th className='p-1 pb-2 text-center'>W</th>
              <th className='p-1 pb-2 text-center'>D</th>
              <th className='p-1 pb-2 text-center'>L</th>
              <th className='p-1 pb-2 text-center'>F</th>
              <th className='p-1 pb-2 text-center'>A</th>
              <th className='p-1 pb-2 text-center'>GD</th>
              <th className='p-1 pb-2 text-center'>Pts</th>
              <th className='hidden p-1 pb-2 text-center md:table-cell'>
                FORM
              </th>
            </tr>
          </thead>
          <tbody>
            {tableStandings.map((match, index) => (
              <tr
                className='border-b bg-white text-left transition duration-300 ease-in-out hover:bg-gray-100'
                key={index}>
                <td className='border-b bg-white p-1 text-left'>{index + 1}</td>
                {index + 1 === 1 ? (
                  <td className='border-b bg-white p-1 text-left font-bold text-green-400'>
                    {match.team}
                  </td>
                ) : index + 1 === 12 || index + 1 === 13 || index + 1 === 14 ? (
                  <td className='border-b bg-white p-1 text-left font-semibold text-red-300'>
                    {match.team}
                  </td>
                ) : match.team === 'West Ham United FC' ? (
                  <td className='border-b bg-white p-1 font-extrabold text-burgundy text-xl text-left'>
                    {match.team}
                  </td>
                ) : (
                  <td className='border-b bg-white p-1 text-left'>
                    {match.team}
                  </td>
                )}
                <td className='p-1 text-center'>{match.gp}</td>
                <td className='p-1 text-center'>{match.wins}</td>
                <td className='p-1 text-center'>{match.draws}</td>
                <td className='p-1 text-center'>{match.losses}</td>
                <td className='p-1 text-center'>{match.goalsFor}</td>
                <td className='p-1 text-center'>{match.goalsAgainst}</td>
                <td className='p-1 text-center'>
                  {match.goalsFor - match.goalsAgainst}
                </td>
                <td className='p-1 text-center'>{match.points}</td>
                <td className='hidden p-1 text-center md:table-cell'>
                  <div className='flex w-full items-center justify-center'>
                    {_.takeRight(match.form, 5).map((f) =>
                      f === 'w' ? (
                        <div className='mx-0.5 mb-2 h-3 w-1 rounded bg-green-500'></div>
                      ) : f === 'l' ? (
                        <div className='mx-0.5 mt-2 h-3 w-1 rounded bg-red-500'></div>
                      ) : (
                        <div className='mx-0.5 mb-1 h-1 w-1 rounded bg-gray-500'></div>
                      )
                    )}
                  </div>
                  {/* <td className='p-1 text-center'>
                  {_.takeRight(match.form, 5)}
                </td> */}
                </td>
              </tr>
            ))}
            {/* {standings.map((s, index) => (
            <tr key={index}>
              <td>{s.homeTeam}</td>
              <td>{s.homeGoals}</td>
            </tr>
          ))} */}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
