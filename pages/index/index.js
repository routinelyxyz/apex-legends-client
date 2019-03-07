import css from './style.scss';
import 'isomorphic-unfetch';
import { getUrl } from '../../helpers';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { animated, useTransition, config } from 'react-spring';
import Head from 'next/head';
import { useDevice, useWindowSize } from '../../hooks';
import { fetchify } from '../../util/fetchify';

import { PlayerCard } from '../../components/PlayerCard';
import { PlayerSearcher } from '../../components/PlayerSearcher';

const avatar = 'https://opgg-static.akamaized.net/images/profile_icons/profileIcon3379.jpg?image=c_scale,w_38&v=1518361200';
/*
  Color for searcher phrase background #FFFAE0
*/

const HomePage = ({ recentUpdates }) => {
  const [stats, setStats] = useState(() => recentUpdates);

  useEffect(() => {
    return;
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index === recentUpdates.length) {
        return clearInterval(interval);
      }
      setStats(prevStats => {
        const updated = [recentUpdates[index], ...prevStats];
        if (updated.length > 5) updated.splice(-1, 1);
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const transitions = useTransition(stats, s => s.player.id, {
    from: { opacity: 0, transform: 'translateX(100px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0 }
  });

  return (
    <article>
      <Head>
        <title>Homepage | Apex-Legends.win</title>
      </Head>
      <div className={css.searcher}>
        <PlayerSearcher/>
      </div>
      <PlayerCard/>
      <table className={css.rank_tab}>
        <thead>
          <th>Rank</th>
          <th>Player</th>
          <th>Kills</th>
        </thead>
        <tbody>
          {transitions.map(({ item, key, props }) => (
            <animated.tr key={key} style={props}>
              <td>{key}</td>
              <td className={css.player}>
                <img
                  src={avatar}
                  className={css.avatar}
                />
                {item.player.name}
              </td>
              <td>2,3614</td>
              {/* <td>{dayjs(item.updatedAt).fromNow()}</td> */}
            </animated.tr> 
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

  const res2 = await fetchify.get('/stats/trending');
  const trending = await res2.json();

  return { recentUpdates, trending };
}

export default HomePage;