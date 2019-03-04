import css from './style.scss';
import { getUrl } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';

import { Navigation } from '../../reusable/Navigation';

const LeadeboardsPage = ({ data, query }) => {
  const [prop, setProp] = useState('kills');
  const [leaderboards, setLeadboards] = useState([]);
  const page = page != null ? Number(query.page) : 1;

  useEffect(() => {
    const lbLength = leaderboards.length;
    if (
      !lbLength ||
      data.length && leaderboards[lbLength - 1].id !== data[0].id
    ) {
      setLeadboards(lb => [...lb, ...data]);
    }
  }, [page]);

  return (
    <div>
      <h1>Leadeboards</h1>
      <Navigation
        page={page}
        pagesCount={10}
      >
        <table className={css.players_table}>
          <thead></thead>
          <tbody>
            {leaderboards.map(record => (
              <tr key={record.id}>
                <td>{record.player.name}</td>
                <td>{record.player.platform}</td>
                <td>{record[prop]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Navigation>
    </div>
  )
}

LeadeboardsPage.getInitialProps = async ({ query }) => {
  const url = '/stats/leaderboards' + qs.stringify(query, true);
  // console.log(url, query);
  const res = await fetch(getUrl(url));
  const { data } = await res.json();
  return { data, query: { page: 1, ...query }};
}

export default LeadeboardsPage;