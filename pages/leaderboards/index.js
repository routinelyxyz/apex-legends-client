import css from './style.scss';
import { getUrl } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { fetchify } from '../../util/fetchify';
import { useMounted } from '../../hooks';
import { statsPropTitles } from '../../helpers';
import Link from 'next/link';

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

const platforms = [
  { name: 'All', value: 'all' },
  { name: 'PC', value: 'pc' },
  { name: 'PS4', value: 'ps4' },
  { name: 'Xbox', value: 'xbox' }
]

const LeadeboardsPage = ({ data, query, router }) => {
  const { perPage = 100 } = data;
  const [leaderboards, setLeadboards] = useState([]);
  const page = router.query.page != null ? Number(router.query.page) : 1;
  const [platform, setPlatform] = useState(initialPlatform);
  const [legend, setLegend] = useState(initialLegend);
  const [prop, setProp] = useState(initialProp);
  const [isFetching, setIsFetching] = useState(false);
  const isMounted = useMounted();


  useEffect(() => {
    if (isFetching || !isMounted) return;
    const query = {};

    if (platform !== initialPlatform) query.platform = platform;
    if (legend !== initialLegend) query.legend = legend;
    if (prop !== initialProp) query.prop = prop;

    const href = '/leaderboards' + qs.stringify(query, true);
    const as = href;

    setIsFetching(true);

    router.replace(href, as, { shallow: false })
      .catch(console.log)
      .finally(_ => setIsFetching(false));

  }, [platform, legend, prop]);

  // useEffect(() => {
  //   const lbLength = leaderboards.length;
  //   if (
  //     !lbLength ||
  //     data.length && leaderboards[lbLength - 1].id !== data[0].id
  //   ) {
  //     setLeadboards(lb => [...lb, ...data]);
  //   }
  // }, [page]);

  return (
    <div>
      <h1>Leaderboards</h1>
      <div className={css.query_container}>
        <div className={css.query_item}>
          <H3>Platform</H3>
          <Select
            value={platform}
            disabled={isFetching}
            active={platform !== initialPlatform}
            onChange={e => setPlatform(
              e.target.value
            )}
          >
            {platforms.map(platform => (
              <option
                value={platform.value}
                key={platform.value}
              >
                {platform.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={css.query_item}>
          <H3>Legend</H3>
          <Select
            value={legend}
            disabled={isFetching}
            active={legend !== initialLegend}
            onChange={e => setLegend(
              e.target.value
            )}
          >
            <option value="all">All</option>
            {legends.map(legend => (
              <option
                value={legend.slug}
                key={legend.id}
              >
                {legend.name}
              </option>
            ))}
          </Select>
        </div>
        <div className={css.query_item}>
          <H3>Property</H3>
          <Select
            value={prop}
            disabled={isFetching}
            active={prop !== initialProp}
            onChange={e => setProp(
              e.target.value
            )}
          > 
            {props.map(prop => (
              <option
                value={prop.value}
                key={prop.value}
              >
                {prop.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Navigation
        page={page}
        pages={data.pages}
        isFetching={isFetching}
        href={p => '/leaderboards?page=' + p}
      >
        <table className={css.players_table}>
          <thead>
            <tr>
              <th className={css.rank}>Rank</th>
              <th>Player</th>
              <th className={css.head_prop}>
                {statsPropTitles[prop] || prop}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((record, index) => (
              <tr key={record.id}>
                <td>{(index + 1) + (page - 1) * perPage}</td>
                <td className={css.player}>
                  <Link
                    href={`/stats?id=${record.player.id}`}
                    as={`/stats/${record.player.platform}/${encodeURI(record.player.name)}`}
                  >
                    <a>
                      {record.player.name}
                    </a>
                  </Link>
                </td>
                <td className={css.prop_val}>
                  {Number(record[prop]).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Navigation>
    </div>
  )
}

LeadeboardsPage.getInitialProps = async (props) => {
  const { query } = props;
  console.log("INITIAL PROPS +++++");
  const res = await fetchify.get('/stats' + props.asPath);
  await new Promise(r => setTimeout(r, 500));
  // const res = await fetch(getUrl('/stats' + props.asPath));
  const data = await res.json();
  return { data, query: { page: 1, ...query }};
}

export default withRouter(LeadeboardsPage);