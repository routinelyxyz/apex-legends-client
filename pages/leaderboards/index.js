import css from './style.scss';
import { getUrl } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';

import { Navigation } from '../../reusable/Navigation';
import { Select } from '../../reusable/Select';
import { H3 } from '../../reusable/Elements';


const legends = [
  {
    name: 'Wraith',
    slug: 'wraith',
    id: 1
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    id: 2
  }
];

const props = [
  { name: 'Kills', value: 'kills' }
]

const initialPlatform = 'all';
const initialLegend = 'all';
const initialProp = 'kills';

const LeadeboardsPage = ({ data, query }) => {
  const [leaderboards, setLeadboards] = useState([]);
  const page = page != null ? Number(query.page) : 1;
  const [platforms, setPlatforms] = useState({
    pc: false,
    psn: false,
    xbox: false
  });
  const [platform, setPlatform] = useState(initialPlatform);
  const [legend, setLegend] = useState(initialLegend);
  const [prop, setProp] = useState(initialProp);



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
      <div className={css.query_container}>
        <div className={css.query_item}>
          <H3>Platform</H3>
          <Select
            value={platform}
            onChange={e => setPlatform(
              e.target.value
            )}
          >
            <option value="All">All</option>
            {Object.keys(platforms).map(platform => (
              <option value={platform}>
                {platform.toUpperCase()}
              </option>
            ))}
          </Select>
        </div>
        <div className={css.query_item}>
          <H3>Legend</H3>
          <Select
            value={legend}
            onChange={e => setLegend(
              e.target.value
            )}
          >
            <option value="all">All</option>
            {legends.map(legend => (
              <option value={legend.slug}>
                {legend.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={css.query_item}>
          <H3>Property</H3>
          <Select
            value={prop}
            onChange={e => setProp(
              e.target.value
            )}
          > 
            {props.map(prop => (
              <option value={prop.value}>
                {prop.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
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