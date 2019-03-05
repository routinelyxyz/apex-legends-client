import css from './style.scss';
import 'isomorphic-unfetch';
import { getUrl } from '../../helpers';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { animated, useTransition, config } from 'react-spring';
import Head from 'next/head';
import { useDevice, useWindowSize } from '../../hooks';


import { PlayerSearcher } from '../../components/PlayerSearcher';

/*
  Color for searcher phrase background #FFFAE0
*/

const HomePage = ({ recentUpdates }) => {
  const [stats, setStats] = useState(() => [recentUpdates[0]]);

  useEffect(() => {
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
      <table className={css.players_table}>
        <thead></thead>
        <tbody>
          {transitions.map(({ item, key, props }) => (
            <animated.tr key={key} style={props}>
              <td>{item.player.name}</td>
              <td>{dayjs(item.updatedAt).fromNow()}</td>
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
  return { recentUpdates };
}

export default HomePage;