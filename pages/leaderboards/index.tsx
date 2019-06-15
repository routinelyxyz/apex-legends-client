import React, { useReducer } from 'react';
import css from './style.scss';
import { getUrl, NODE_ENV } from '../../helpers';
import qs from 'querystringify';
import { useState, useEffect } from 'react';
import { withRouter, RouterProps } from 'next/router';
import { useMounted } from '../../hooks';
import { statsPropTitles, statsProps, statsTitlesMap, platforms } from '../../helpers';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';

import { Navigation } from '../../reusable/Navigation';
import { Select } from '../../reusable/Select';
import { H3 } from '../../reusable/Elements';
import { PlayersTable } from '../../components/PlayersTable';
import { leaderboardsReducer, initLeaderboardsReducer, initialState } from './reducer';
import { LegendBase, Platform } from '../../types';


const initialLegend = 'all';
const initialProp = 'kills';

interface LeaderboardsPageProps {
  data: any
  legends: LegendBase[]
  router: RouterProps
}
const LeadeboardsPage = ({
  data,
  query,
  legends,
  router
}: LeaderboardsPageProps) => {
  const { perPage = 100 } = data;
  const [state, dispatch] = useReducer(leaderboardsReducer, query, initLeaderboardsReducer);
  const page = router.query.page != null ? Number(router.query.page) : 1;
  const [legend, setLegend] = useState(query.legend || initialLegend);
  const [prop, setProp] = useState(query.prop || initialProp);
  const isMounted = useMounted();

  const statProps = statsProps[legend === 'all' ? 'lifetime' : 'legend'];

  const handleLegendUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    if (
      legend === 'all' ||
      (legend !== 'all' && value === 'all')
    ) {
      setProp(initialProp);
    }
    setLegend(value);

    dispatch({
      type: 'UPDATE_LEGEND',
      payload: event.target.value
    });
  }

  useEffect(() => {
    const query: any = {};
    const { platform, legend, property } = state;

    if (!isMounted || state.isFetching) {
      return;
    }

    if (platform !== initialState.platform) query.platform = platform;
    if (legend !== initialState.legend) query.legend = legend;
    if (property !== initialState.property) query.prop = property;

    const href = '/leaderboards' + qs.stringify(query, true);
    const as = href;

    router.replace(href, as, { shallow: false })
      .catch(console.log)
      .finally(() => dispatch({ type: 'UPDATE_FINISHED' }))

  }, [state.platform, state.legend, state.property, isMounted]);

  const handlePlatformUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_PLATFORM',
      payload: event.target.value as Platform
    });
  }

  const handlePropertyUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_PROPERTY',
      payload: event.target.value
    });
  }

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
            value={state.platform}
            disabled={state.isFetching}
            active={state.platform !== initialState.platform}
            onChange={handlePlatformUpdate}
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
            value={state.legend}
            disabled={state.isFetching}
            active={state.legend !== initialState.legend}
            onChange={handleLegendUpdate}
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
            value={state.property}
            disabled={state.isFetching}
            active={state.property !== initialState.property}
            onChange={handlePropertyUpdate}
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
        activePage={page}
        pagesCount={data.pages}
        href={p => '/leaderboards?page=' + p}
        menuTop
      >
        <PlayersTable
          data={data.data}
          prop={prop}
          renderRank={index => (index + 1) + (page - 1) * perPage}
          clearFilters={() => dispatch({ type: 'CLEAR_FILTERS' })}
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
  
  if (props.asPath !== '/leaderboards' && NODE_ENV === 'production') {
    await new Promise(r => setTimeout(r, 150));
  }

  return {
    stats: leaderboards.data,
    data: leaderboards.data,
    legends: legends.data.data,
    query: { page: 1, ...query }
  }
}

interface QueryParams {

}

export default withRouter(LeadeboardsPage);