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
import { PlayersTable } from '../../components/PlayersTable';
 

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

  const top3Players = recentUpdates.slice(0, 3);
  const restPlayers = recentUpdates.slice(3, recentUpdates.length);
  // const [top1, top2, top3, ...restPlayers] = recentUpdates;
  // const top3Players = [top1, top2, top3]; 

  return (
    <article>
      <Head>
        <title>Homepage | Apex-Legends.win</title>
      </Head>
      <div className={css.searcher}>
        <PlayerSearcher/>
      </div>
      {!!top3Players.length && (
        <>
          <h2 className={css.top_header}>Best players of day</h2>
          <div className={css.cards_container}>
            {top3Players.map((stats, index) => (
              <div className={css.card_container} key={index}>
                <p className={css.place}>
                  {index + 1}
                </p>
                <PlayerCard
                  className={css.card}
                  place={index + 1}
                  data={stats}
                  scaleSize
                />
              </div>
            ))}
          </div>
          {!!restPlayers.length && (
            <PlayersTable
              data={restPlayers}
              renderRank={index => 4 + index}
              prop="kills"
            />
          )}
        </>
      )}
    </article>
  )
}

HomePage.getInitialProps = async () => {
  try {
    const res = await fetch(getUrl('/stats/recently-updated'));
    const data = await res.json();
    const recentUpdates = data.reverse();
  
    const res2 = await fetchify.get('/stats/trending');
    const trending = await res2.json();

    return { recentUpdates, trending };

  } catch {
    return { recentUpdates: [], trending: [] }
  }
}

export default HomePage;