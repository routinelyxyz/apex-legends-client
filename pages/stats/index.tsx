import React, { useReducer, useMemo } from 'react';
import 'isomorphic-unfetch';
import css from './style.scss';
import { getAvatar } from '../../helpers';
import { animated, useSpring } from 'react-spring';
import { useState, useEffect } from 'react';
import { getTs, applyCss } from '../../util';
import Head from 'next/head';
import { withRouter, RouterProps } from 'next/router';
import { useFirstRender } from '../../hooks';
import NProgress from 'nprogress';
import { Stats } from '../../types';
import { fetchInitialStats, FetchInitialStatsResult, updateStats, fetchStats, fetchMatchHistory } from './fetchInitialStats';
import { statsReducer, initStatsReducer, groupMatchHistory } from './reducer';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNavTab } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';
import { StatsHistory } from '../../components/StatsHistory';
import { PlayerSearcher } from '../../components/PlayerSearcher';
import { LegendStatsValue } from '../../components/LegendStatsValue';
import { InfoCard } from '../../components/InfoCard';


const StatsPage = ({
  stats,
  router,
  skipFirstFetch
}: StatsPageProps) => {
  const [state, dispatch] = useReducer(statsReducer, { stats, skipFirstFetch }, initStatsReducer);
  const [now, setNow] = useState(getTs());
  const afterFirstRender = useFirstRender();
  const counter = state.nextUpdateAt - now;

  async function handleStatsUpdate(player = state.player) {
    try {
      if (state.isUpdating || !player) {
        return;
      }
      const latestMatch = await updateStats(player);

      dispatch({ type: 'UPDATE_STATS_REQUESTED' });
      NProgress.start();

      if (latestMatch) {
        const nextStats = await fetchStats(player);

        dispatch({
          type: 'MATCH_HISTORY_UPDATE',
          payload: [latestMatch]
        });

        if (
          nextStats &&
          router.query &&
          router.query.name === nextStats.player.name
        ) {
          dispatch({
            type: 'UPDATE_STATS_SUCCEEDED',
            payload: nextStats
          });
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'UPDATE_STATS_FINISHED'});
      NProgress.done();
    }
  }

  async function handleMatchHistoryUpdate() {
    if (!state.player || state.isLoadingHistory) {
      return;
    }
    dispatch({ type: 'MATCH_HISTORY_REQUESTED' });

    const matchHistory = await fetchMatchHistory(state.player.id);

    dispatch({
      type: 'MATCH_HISTORY_SUCCEEDED',
      payload: matchHistory
    });
  }

  useEffect(() => {
    const interval = setInterval(() => setNow(getTs()), 1000);
    if (
      stats &&
      state.player &&
      afterFirstRender &&
      stats.player.name !== state.player.name
    ) {
      dispatch({
        type: 'UPDATE_STATS',
        payload: stats
      });
    }

    return () => clearInterval(interval);
  }, [stats, afterFirstRender]);

  const calcNextUpdate = () => {
    const seconds = counter % 60;
    const minutes = Math.floor(counter / 60);
    if ((minutes <= 0 && seconds <= 0) || state.isUpdating) {
      return 'Just now';
    }
    return (minutes ? `${minutes} min. ` : '') + `${seconds} sec.`;
  }
  const updateIn = calcNextUpdate();

  if (counter <= 0 && !state.isUpdating) {
    handleStatsUpdate();
  }

  const lvlProps = useSpring({
    from: { lvl: 0 },
    to: { lvl: state.lifetimeStats.lvl.value },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 }
  });

  const rankProps = useSpring({
    from: { rank: 1 },
    to: { rank: state.lifetimeStats.kills.rank },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 }
  });

  const matchHistory = useMemo(() => groupMatchHistory(state.matchHistory), [state.matchHistory]);

  return (
    <div>
      <Head>
        <title>{stats.player.name} - Stats | Apex-Legends.win</title>
      </Head>
      <div className={css.player}>
        <div className={css.player__badge}>
          <ProgressRing
            radius={73}
            stroke={7}
            progress={stats.lifetime.lvlProgress}
          />
          <div className={css.avatar__container}>
            <img
              src={getAvatar(stats.player)}
              className={css.avatar__image}
            />
          </div>
        </div>
        <div className={css.player__info}>
          <h1 className={css.player__name}>
            {stats.name || stats.player.name}
          </h1>
          <div className={css.info_card__container}>
            <InfoCard
              title="Rank"
              content={(
                <animated.span className={stats.lifetime.kills.rank <= 10 && css.player__colored_rank}>
                  {rankProps.rank.interpolate(v => v.toFixed())}
                </animated.span>
              )}
              className={css.info_card__item}
            />
            <InfoCard
              title="Platform"
              className={css.info_card__item}
              content={(
                <img
                  className={css.info_card__platform_image}
                  src={`/static/img/${stats.player.platform}-rose.svg`}
                />
              )}
            />
            <InfoCard
              title="Level"
              content={(
                <animated.span>
                  {lvlProps.lvl.interpolate(v => v.toFixed())}
                </animated.span>
              )}
            />
          </div>
        </div>
        <div className={css.update__container}>
          <p className={css.update__title}>
            Update in:
          </p>
          {updateIn}
        </div>
      </div>
      <h2 className={css.lifetime_stats__title}>
        Lifetime stats
      </h2>
      <div className={css.lifetime_stats__container}>
        {lifetimeStats.length ? (
          <ul className={css.lifetime_stats__list}>
            {lifetimeStats.map(stats => (
              <LegendStatsValue
                key={stats.prop}
                {...stats}
              />
            ))}
          </ul>
        ) : (
          <p>No lifetime stats were found</p>
        )}
      </div>
      <HorizontalNavTab
        withMargin
        tabs={[
          {
            title: 'Legend Stats',
            content: state.legendStats.map(legendStats => (
              <LegendStats
                stats={legendStats}
                key={legendStats.id}
              />
            ))
          },
          {
            title: 'Match history',
            content: (
              <StatsHistory
                matchHistory={matchHistory}
                isUpdating={state.isLoadingHistory}
                updateMatchHistory={handleMatchHistoryUpdate}
              />
            )
          }
        ]}
      >
      </HorizontalNavTab>
    </div>
  )
}

const RenderError = ({ status, platform, name }: FetchInitialStatsResult) => {
  if (name == null || !name.length) {
    return null
  }
  return (
    <div className={css.error__container}>
      <p className={css.error__title}>
        {status === 404
          ? (
            <>
              Player 
              <strong className={css.error__player_name}>
                {name}
              </strong> doesn't exist on platform {platform}
            </>
          )
          : 'Server error. Please try again.' 
        }
      </p>
    </div>
  )
}

const StatsPageContainer = (props: FetchInitialStatsResult) => {
  const { stats, error = false, skipFirstFetch, router } = props;
  const isError = error || !stats;
  return (
    <>
      <Head>
        <title>Stats | Apex-Legends.win</title>
      </Head>
      {isError && <RenderError {...props} />}
      <div {...applyCss(!isError && css.searcher)}>
        <PlayerSearcher
          statsPage={!isError}
          pageMode
        />
      </div>
      {!isError && (
        <StatsPage
          stats={stats as Stats}
          skipFirstFetch={skipFirstFetch}
          router={router}
        />
      )}
    </>
  );
}

StatsPageContainer.getInitialProps = async ({ query, ...props }: any) => {
  const { platform, name, id } = query;

  if (!name || !platform) {
    return { stats: null }
  }

  const result = await fetchInitialStats(query);
  return { ...result, ...props }
}

interface QueryParams {
  id?: string
  platform: string
  name: string
}

interface StatsPageProps {
  stats: Stats
  skipFirstFetch: boolean
  router: RouterProps
}

export default withRouter(StatsPageContainer);