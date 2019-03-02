import css from './style.scss';
import 'isomorphic-unfetch';
import { getUrl } from '../../helpers';
import dayjs from 'dayjs';

import { PlayerSearcher } from '../../components/PlayerSearcher';

const HomePage = ({ recentUpdates }) => {
  return (
    <article>
      <PlayerSearcher/>
      <table className={css.players_table}>
        <thead></thead>
        <tbody>
          {recentUpdates.map((stats, index) => (
            <tr key={index}>
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
  const recentUpdates = await res.json();
  return { recentUpdates };
}

export default HomePage;