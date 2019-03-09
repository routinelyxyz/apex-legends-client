import css from './style.scss';
import { useEffect, useState, useMemo } from 'react';
import { fetchify } from '../../../util/fetchify';
import { round, applyCss } from '../../../util';
import { statsPropTitles } from '../../../helpers';
import Head from 'next/head';


const fetchPlayer = async playerId => {
  const data = await fetchify.get(`/stats/undefined/undefined?id=${playerId}`);
  const { stats } = await data.json();
  return stats;
}

const comparableProps = {
  damage: 0,
  kills: 0,
  damagePerKill: 0,
  headshots: 0,
  headshotsPerKill: 0,
  lvl: 0
}

const comparProps = [
  'damage', 'kills', 'damagePerKill', 'headshots', 'headshotsPerKill', 'lvl'
]


const StatsColumn = ({ players, prop, stats, index }) => {
  const value = players[index][prop];
  const percents = stats[prop];

  const percentages = (
    (players.length === 2 && index === 1)
    || players.length > 2
  ) && (
    <span
      {...applyCss(
        css.perc_val,
        percents < 0 ? css.perc_below : css.perc_above
      )}
    >
      {percents}
    </span>
  );

  return (
    <td key={index}>
      {value == null
        ? 'NA'
        : (
        <>
          <p className={css.value}>
            {value.toLocaleString('en-US')}
          </p>
          {percentages}
        </>
      )}
    </td> 
  )
}


const CompareStatsPage = ({ playersData }) => {
  const [players, setPlayers] = useState(playersData);
  const playerNames = useMemo(() => players
    .map(p => p.name)
    .join(', ')
  , [players.length]);

  useEffect(() => {
  }, []);


  const comparedPlayers = useMemo(() => {
    const summedStats = players
      .reduce((sum, stats, index) => {

        for (let prop in sum) {
          sum[prop] += stats[prop];

          const divideBy = players
            .filter(stats => stats[prop] != null)
            .length;

          if (index === players.length - 1) {
            sum[prop] = sum[prop] / divideBy;
          }
        }

        return sum;
      }, { damage: 0, kills: 0, damagePerKill: 0, headshots: 0, headshotsPerKill: 0, lvl: 0 });

    const statsRatios = players.map(stats => {
      const compared = {};
      for (let prop in comparableProps) {
        const comparedVal = stats[prop] / summedStats[prop] * 100;

        const changeDir = comparedVal < 100
        ? (100 - comparedVal) * -1 
        : comparedVal - 100

        compared[prop] = round(changeDir);
      }
      return compared;
    });
    return statsRatios;
  }, [players.length]);

  return (
    <div>
      <Head>
        <title>{playerNames} - Compare stats | Apex-Legends.win</title>
      </Head>
      <h1>Compare stats</h1>
      <table className={css.comparison_table}>
        <thead>
          <tr>
            <th>Stats</th>
            {players.map(player => (
              <th key={player.id}>
                {player.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparProps.map(prop => (
            <tr key={prop}>
              <td className={css.prop_title}>
                {statsPropTitles[prop] || prop}
              </td>
              {comparedPlayers.map((stats, index) => (
                <StatsColumn
                  key={index}
                  stats={stats}
                  index={index}
                  prop={prop}
                  players={players}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

CompareStatsPage.getInitialProps = async ({ query: { player }}) => {
  const players = Array.isArray(player) ? player : [player];

  const playersData = await Promise.all(
    players.map(id => fetchPlayer(id))
  );

  return { playersData };
}

export default CompareStatsPage;