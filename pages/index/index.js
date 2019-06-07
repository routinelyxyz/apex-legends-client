import css from './style.scss';
import 'isomorphic-unfetch';
import Head from 'next/head';
import axios from 'axios';
import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { PlayerCard } from '../../components/PlayerCard';
import { PlayerSearcher } from '../../components/PlayerSearcher';
import { PlayersTable, Table, PlayerLabel, Td, Th } from '../../components/PlayersTable';

dayjs.extend(utc);
const endOfDay = dayjs().utc().endOf('day');

const HomePage = ({ dailyRanking, recentlyUpdated }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const handleTimeCounter = () => {
    const secondsLeft = endOfDay.diff(dayjs().utc(), 'seconds');

    const seconds = secondsLeft % 60;
    const minutes  = Math.floor((secondsLeft % 3600) / 60);
    const hours  = Math.floor(secondsLeft / 3600);

    const formatted = [hours, minutes, seconds]
      .map(value => value.toString().padStart(2, '0'))
      .join(' : ');

    setTimeLeft(formatted);
  }

  useEffect(() => {
    handleTimeCounter();
    const intervalId = setInterval(handleTimeCounter, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const [top3Players, restPlayers] = useMemo(() => [
    dailyRanking.slice(0, 3),
    dailyRanking.slice(3, dailyRanking.length)
  ], [dailyRanking]);

  return (
    <article>
      <Head>
        <title>Homepage | Apex-Legends.win</title>
      </Head>
      <PlayerSearcher pageMode testId="main"/>
      {!!top3Players.length && (
        <>
          <h2 className={css.top_header}>
            Best players of the day
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
      {!!recentlyUpdated.length && (
        <>
          <h2 className={`${css.top_header} ${css.top_header__recent}`}>
            Recent matches
          </h2>
          <Table
            thead={(
              <tr>
                <Th>Player</Th>
                <Th align="center">Kills</Th>
                <Th align="right">Time ago</Th>
              </tr>
            )}
            tbody={recentlyUpdated.map(stats => (
              <tr key={stats.id}>
                <Td>
                  <div className={css.table_field__first}>
                    <PlayerLabel player={stats.player}/>
                  </div>
                </Td>
                <Td align="center" fontSize={18}>
                  +{stats.kills || 0}
                </Td>
                <Td align="right">
                  <span className={css.table_field__last}>
                    {dayjs(stats.date).fromNow()}
                  </span>
                </Td>
              </tr>
            ))}
          />
        </>
      )}
    </article>
  )
}

HomePage.getInitialProps = async () => {
  try {

    const options = { timeout: 500 };
    const [dailyRanking, recentlyUpdated] = await Promise.all([
      axios.get('/stats/v2/daily-ranking', options),
      axios.get('/stats/v2/recently-updated', options)
    ]); 

    return {
      dailyRanking: dailyRanking.data.data,
      recentlyUpdated: recentlyUpdated.data.data
    };

  } catch(err) {
    return { dailyRanking: [], recentlyUpdated: [] };
  }
}

export default HomePage;