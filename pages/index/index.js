import css from './style.scss';
import 'isomorphic-unfetch';
import Head from 'next/head';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { PlayerCard } from '../../components/PlayerCard';
import { PlayerSearcher } from '../../components/PlayerSearcher';
import { PlayersTable } from '../../components/PlayersTable';

const endOfDay = dayjs().utc().endOf('day');

const HomePage = ({ dailyRanking }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const handleTimeCounter = () => {
    const secondsLeft = endOfDay.diff(dayjs().utc(), 'seconds');

    const seconds = secondsLeft % 60;
    const minutes  = ~~((secondsLeft % 3600) / 60);
    const hours  = ~~(secondsLeft / 3600);

    const formatted = [hours, minutes, seconds]
      .map(v => v < 10 ? '0' + v : v)
      .join(' : ');

    setTimeLeft(formatted);
  }

  useEffect(() => {
    handleTimeCounter();
    const intervalId = setInterval(handleTimeCounter, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const { top3Players, restPlayers } = useMemo(() => ({
    top3Players: dailyRanking.slice(0, 3),
    restPlayers: dailyRanking.slice(3, dailyRanking.length)
  }), [dailyRanking]);

  return (
    <article>
      <Head>
        <title>Homepage | Apex-Legends.win</title>
      </Head>
      <PlayerSearcher pageMode/>
      {!!top3Players.length && (
        <>
          <h2 className={css.top_header}>
            Best players of day
          </h2>
          <p className={css.top_counter}>
            {timeLeft}
          </p>
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

    const options = { timeout: 500 };
    const dailyRanking = await axios.get('/stats/daily-ranking', options);

    return {
      dailyRanking: dailyRanking.data.data
    }

  } catch(err) {
    return { recentUpdates: [], trending: [] }
  }
}

export default HomePage;