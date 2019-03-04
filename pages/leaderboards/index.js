import css from './style.scss';
import { getUrl } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { fetchify } from '../../util/fetchify';
import { useMounted } from '../../hooks';

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
      <h1>Leadeboards {isFetching.toString()}</h1>
      {isMounted.toString()}
      <div className={css.query_container}>
        <div className={css.query_item}>
          <H3>Platform</H3>
          <Select
            value={platform}
            disabled={isFetching}
            onChange={e => setPlatform(
              e.target.value
            )}
          >
            {platforms.map(platform => (
              <option value={platform.value}>
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
            disabled={isFetching}
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
        pages={data.pages}
        isFetching={isFetching}
        href={'/leaderboards?page='}
      >
        <table className={css.players_table}>
          <thead></thead>
          <tbody>
            {data.data.map(record => (
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

LeadeboardsPage.getInitialProps = async (props) => {
  const { query } = props;
  console.log("INITIAL PROPS +++++");
  const res = await fetchify.get('/stats' + props.asPath);
  // await new Promise(r => setTimeout(r, 500));
  // const res = await fetch(getUrl('/stats' + props.asPath));
  const data = await res.json();
  return { data, query: { page: 1, ...query }};
}

export default withRouter(LeadeboardsPage);