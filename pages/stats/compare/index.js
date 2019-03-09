import css from './style.scss';
import { useEffect, useState, useMemo } from 'react';
import { fetchify } from '../../../util/fetchify';
import { round, applyCss } from '../../../util';
import { statsPropTitles } from '../../../helpers';


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


const CompareStatsPage = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayer(4)
      .then(stats =>
        setPlayers(p => [...p, stats])
      )
    fetchPlayer(2)
      .then(stats =>
        setPlayers(p => [...p, stats])
      )
    fetchPlayer(23)
      .then(stats =>
        setPlayers(p => [...p, stats])
      )
  }, []);


  const comparedPlayers = useMemo(() => {
    const summedStats = players
      .reduce((sum, stats, index) => {

        for (let prop in sum) {
          sum[prop] += stats[prop];

          if (index === players.length - 1) {
            sum[prop] = sum[prop] / players.length;
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

        compared[prop] = round(changeDir)
      }
      return compared;
    });
    return statsRatios;
  }, [players.length]);


  return (
    <div>
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
          {comparProps.map((prop, index) => (
            <tr key={prop}>
              <td className={css.prop_title}>
                {statsPropTitles[prop] || prop}
              </td>
              {comparedPlayers.map((stats, index) => (
                <td key={index}>
                  {players[index][prop] == null
                    ? 'NA'
                    : (
                    <>
                      <p className={css.value}>
                        {players[index][prop].toLocaleString('en-US')}
                      </p>
                      <span
                        {...applyCss(
                          css.perc_val,
                          stats[prop] < 0 ? css.perc_below : css.perc_above
                        )}
                      >
                        {stats[prop]}
                      </span>
                    </>
                  )}

                </td> 
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// CompareStatsPage.getIntialProps = async () => {

// }

export default CompareStatsPage;