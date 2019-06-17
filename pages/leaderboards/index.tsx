import React, { useReducer } from 'react';
import css from './style.scss';
import qs from 'querystringify';
import { useEffect } from 'react';
import { withRouter, RouterProps } from 'next/router';
import { useMounted } from '../../hooks';
import { statsProps, statsTitlesMap, platforms } from '../../helpers';
import Head from 'next/head';
import Axios from 'axios';
import { leaderboardsReducer, initLeaderboardsReducer, initialState } from './reducer';
import { LegendBase, Platform } from '../../types';
import { NODE_ENV } from '../../helpers/consts';

import { Navigation } from '../../reusable/Navigation';
import { Select } from '../../reusable/Select';
import { H3 } from '../../reusable/Elements';
import { PlayersTable } from '../../components/PlayersTable';


interface LeaderboardsPageProps {
  data: any
  legends: LegendBase[]
  router: RouterProps<QueryParams>
}
const LeadeboardsPage = ({
  data,
  legends,
  router
}: LeaderboardsPageProps) => {
  const isMounted = useMounted();
  const [state, dispatch] = useReducer(
    leaderboardsReducer, router.query, initLeaderboardsReducer
  );
  const statProps = statsProps[state.legend === 'all' ? 'lifetime' : 'legend'];
  const { perPage = 100 } = data;
  const activePage = (
    router.query &&
    router.query.page
    && Number(router.query.page)
  ) || 1;

  useEffect(() => {
    const { platform, legend, property } = state;
    const query: any = {};

    if (!isMounted || state.isFetching) {
      return;
    }

    if (platform !== initialState.platform) query.platform = platform;
    if (legend !== initialState.legend) query.legend = legend;
    if (property !== initialState.property) query.prop = property;

    const href = '/leaderboards' + qs.stringify(query, true);
    const as = href;

    dispatch({ type: 'FETCH_REQUESTED' });

    router.replace(href, as, { shallow: false })
      .catch(console.log)
      .finally(() => dispatch({ type: 'FETCH_FINISHED' }));

  }, [state, isMounted]);

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

  const handleLegendUpdate = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_LEGEND',
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
                {(statsTitlesMap as any)[prop] || prop}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <Navigation
        activePage={activePage}
        pagesCount={data.pages}
        href={p => '/leaderboards?page=' + p}
        menuTop
      >
        <PlayersTable
          data={data.data}
          prop={state.property}
          renderRank={index => (index + 1) + (activePage - 1) * perPage}
          clearFilters={() => dispatch({ type: 'CLEAR_FILTERS' })}
        />
      </Navigation>
    </div>
  )
}

LeadeboardsPage.getInitialProps = async (props: {
  query?: QueryParams
  asPath: string
}) => {
  const { query = {} } = props;

  const [leaderboards, legends] = await Promise.all([
    Axios.get('/stats' + props.asPath),
    Axios.get('/legends')
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

export interface QueryParams {
  platform?: Platform
  legend?: string
  page?: number
  prop?: string
}

export default withRouter(LeadeboardsPage);