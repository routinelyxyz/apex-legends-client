import css from './style.scss';
import { getUrl } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import { useMounted } from '../../hooks';
import { statsPropTitles, statsProps, statsTitlesMap, platforms } from '../../helpers';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

import { Navigation } from '../../reusable/Navigation';
import { Select } from '../../reusable/Select';
import { H3 } from '../../reusable/Elements';
import { PlayersTable } from '../../components/PlayersTable';


const initialPlatform = 'all';
const initialLegend = 'all';
const initialProp = 'kills';


const LeadeboardsPage = ({ data, query, legends, router }) => {
  const { perPage = 100 } = data;
  const [leaderboards, setLeadboards] = useState([]);
  const page = router.query.page != null ? Number(router.query.page) : 1;
  const [platform, setPlatform] = useState(initialPlatform);
  const [legend, setLegend] = useState(initialLegend);
  const [prop, setProp] = useState(initialProp);
  const [isFetching, setIsFetching] = useState(false);
  const isMounted = useMounted();

  const statProps = statsProps[legend === 'all' ? 'lifetime' : 'legend'];

  const handleLegendSet = e => {
    const { value } = e.target;
    if (
      legend === 'all' ||
      (legend !== 'all' && value === 'all')
    ) {
      setProp(initialProp);
    }
    setLegend(value);
  }

  const clearFilters = () => {
    setPlatform(initialPlatform);
    setLegend(initialLegend);
    setProp(initialProp);
  }

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
      <Head>
        <title>Leaderboards | Apex-Legends.win</title>
      </Head>
      <h1>Leaderboards</h1>
      <div
        className={css.query_container}
        data-testid="Leaderboards__query-container"
      >
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
            onChange={handleLegendSet}
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
            {statProps.map(prop => (
              <option
                className={css.stats_props}
                value={prop}
                key={prop}
              >
                {statsTitlesMap[prop] || prop}
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
        <PlayersTable
          data={data.data}
          prop={prop}
          renderRank={index => (index + 1) + (page - 1) * perPage}
          clearFilters={clearFilters}
        />
      </Navigation>
    </div>
  )
}

LeadeboardsPage.getInitialProps = async (props) => {
  const { query } = props;

  const [leaderboards, legends] = await Promise.all([
    axios.get('/stats' + props.asPath),
    axios.get('/legends')
  ]);
  
  if (props.asPath !== '/leaderboards' && process.env.NODE_ENV === 'production') {
    await new Promise(r => setTimeout(r, 200));
  }

  return {
    stats: leaderboards.data,
    data: leaderboards.data,
    legends: legends.data.data,
    query: { page: 1, ...query }
  }
}

export default withRouter(LeadeboardsPage);