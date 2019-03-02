import css from './style.scss';
import 'isomorphic-unfetch';
import { getUrl } from '../../helpers';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

import { PlayerSearcher } from '../../components/PlayerSearcher';

/*
  Color for searcher phrase background #FFFAE0
*/

const HomePage = ({ recentUpdates }) => {
  // const [stats, setStats] = useState(() => recentUpdates.slice(0, 5));
  const [stats, setStats] = useState(() => []);
  const [arr, setArr] = useState([1, 2, 3]);

  useEffect(() => {
    let index = 3;
    const interval = setInterval(() => {
      index++;
      if (index === 10) {
        return clearInterval(interval);
      }
      const updatedStats = [
        ...stats,
        recentUpdates[index]
      ];
      const arx = arr;
      setArr([...arx, 4])
      // console.log(updatedStats)
      // const updatedStats = [...stats, recentUpdates[index]];
      // updatedStats.shift();
      setStats(stats.concat(recentUpdates[index]));
    }, 2000);
  }, []);


  return (
    <article>
      <PlayerSearcher/>
      <table className={css.players_table}>
        <thead></thead>
        <tbody>
          {stats.map((stats, index) => (
            <tr key={stats.player.id}>
              <td>{stats.player.name}</td>
              <td>{dayjs(stats.updatedAt).fromNow()}</td>
            </tr>            
          ))}
        </tbody>
      </table>
    </article>
  )
}

HomePage.getInitialProps = async () => {
  const res = await fetch(getUrl('/stats/recently-updated'));
  const data = await res.json();
  const recentUpdates = data.reverse();
  return { recentUpdates };
}

export default HomePage;