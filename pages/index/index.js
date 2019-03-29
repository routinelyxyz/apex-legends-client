import css from './style.scss';
import 'isomorphic-unfetch';
import Head from 'next/head';
import axios from 'axios';

import { PlayerCard } from '../../components/PlayerCard';
import { PlayerSearcher } from '../../components/PlayerSearcher';
import { PlayersTable } from '../../components/PlayersTable';
 

const HomePage = ({ dailyRanking }) => {

  const top3Players = dailyRanking.slice(0, 3);
  const restPlayers = dailyRanking.slice(3, dailyRanking.length);

  return (
    <article>
      <Head>
        <title>Homepage | Apex-Legends.win</title>
      </Head>
      <PlayerSearcher pageMode/>
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