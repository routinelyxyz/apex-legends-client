import 'isomorphic-unfetch';
import css from './style.scss';
import { getAvatar, statsProps } from '../../helpers';
import { animated, useSpring } from 'react-spring';
import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { getTs, getUniqueById } from '../../util';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateDynamic } from '../../store/mappers';
import Head from 'next/head';
import axios from 'axios';
import { withRouter } from 'next/router';
import { useFirstRender } from '../../hooks';
import NProgress from 'nprogress';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNavTab } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';
import { StatsHistory } from '../../components/StatsHistory';
import { PlayerSearcher } from '../../components/PlayerSearcher';
import { LegendStatsValue } from '../../components/LegendStatsValue';
import { InfoCard } from '../../components/InfoCard';

const getURL = player => {
  const { platform, name, id = '' } = player;
  return `/stats/v2/${platform}/${encodeURIComponent(name)}?id=${id}`;
}

async function fetchStats(player) {
  const response = await axios.get(getURL(player));
  return response.data.data;
}

async function updateStats(player) {
  const response = await axios.post(getURL(player));
  return response.data.latestMatch;
}

const countdown = process.env.NODE_ENV === 'production' ? 178 : 120;

const StatsPage = ({ name, url, platform, router, skipFirstFetch = false, ...props }) => {
  const afterFirstRender = useFirstRender();
  const [stats, setStats] = useState(() => props.stats);
  const [matchHistory, setMatchHistory] = useState([]);
  const [now, setNow] = useState(getTs());
  const [to, setTo] = useState(getTs() + (skipFirstFetch ? countdown : 3));
  const [isUpdating, setUpdating] = useState(false);
  const counter = to - now;

  const handleMatchHistoryUpdate = nextMatchHistory => {
    const addDayToRecord = record => ({
      ...record,
      day: dayjs(record.date).format('YYYY-MM-DD')
    });
    const nextMatchHistoryWithDay = nextMatchHistory.map(addDayToRecord);

    setMatchHistory(prevMatchHistory => 
      getUniqueById([...nextMatchHistoryWithDay, ...prevMatchHistory])
        .sort((a, b) => a.id > b.id ? -1 : 1)
    );
  }

  const handleStatsUpdate = async (player = stats.player) => {
    if (isUpdating) return;

    try {
      setUpdating(true);
      NProgress.start();
      const latestMatch = await updateStats(player);

      if (latestMatch) {
        handleMatchHistoryUpdate([latestMatch]);

        const nextStats = await fetchStats(player);
        if (router.query.name === nextStats.player.name) {
          setStats(nextStats);
        }
      }

    } catch (err) {
      console.error(err);
    } finally {
      setTo(getTs() + countdown);
      setUpdating(false);
      NProgress.done();
    }
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);

    if (stats && afterFirstRender && props.stats.player.name !== stats.player.name) {
      setStats(props.stats);
      setTo(getTs() + 3);
      // props.actions.savePlayerAsync(props.stats.player);
    } else {
      // props.actions.savePlayerAsync(stats.player);
    }

    return () => clearInterval(interval);
  }, [props.stats, afterFirstRender]);

  useEffect(() => {
    if (counter <= 0 && !isUpdating) {
      handleStatsUpdate();
    }
  }, [counter]);

  const updateIn = useMemo(() => {
    const seconds = counter % 60;
    const minutes = Math.floor(counter / 60);
    if ((minutes <= 0 && seconds <= 0) || isUpdating) return 'Just now';
    return (minutes ? `${minutes} min. ` : '') + `${seconds} sec.`;
  }, [counter, isUpdating]);

  const lvlProps = useSpring({
    from: { lvl: 0 },
    to: { lvl: stats.lifetime.lvl.value },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 }
  });

  const rankProps = useSpring({
    from: { rank: 1 },
    to: { rank: stats.lifetime.kills.rank },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 }
  });

  const sortedLegends = useMemo(() =>
    stats.legends.sort((a, b) => a.kills.value > b.kills.value ? -1 : 1)
  , [stats]);

  const lifetimeStats = useMemo(() =>
    statsProps.legend
      .map(prop => ({
        prop,
        ...stats.lifetime[prop]
      }))
      .filter(propObj => propObj.value != null)
  , [stats]);

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
            content: (
              <>
                {sortedLegends.map(legendStats => (
                  <LegendStats
                    stats={legendStats}
                    key={legendStats.id}
                  />
                ))}
              </>
            )
          },
          {
            title: 'Match history',
            content: (
              <StatsHistory
                player={stats.player}
                matchHistory={matchHistory}
                setMatchHistory={handleMatchHistoryUpdate}
              />
            )
          }
        ]}
      >
      </HorizontalNavTab>
    </div>
  )
}

const RenderError = ({ status, platform, name }) => {
  if (!!!name) return null;
  return (
    <div className={css.error__container}>
      <p className={css.error__title}>
        {status === 404
          ? (
            <>
              <strong className={css.error__player_name}>
                {name}
              </strong> doesn't exist on platform {platform}
            </>
          )
          : `Server error. Please try again.` 
        }
      </p>
    </div>
  )
}

const StatsPageContainer = (props) => {
  const { stats, error } = props;
  const isError = error || !stats;
  
  return (
    <>
      {isError && <RenderError {...props} />}
      <PlayerSearcher
        statsPage={!isError}
        pageMode
      />
      {!isError && <StatsPage {...props} />}
    </>
  );
}

StatsPageContainer.getInitialProps = async ({ query }) => {
  const { platform, name, id = '' } = query;

  if ((!name || !platform) && !id) {
    return { stats: null };
  }

  try {
    const stats = await fetchStats(query);
    return { stats, platform, name, id };
  } catch (err) {
    const { status = 500 } = err.response || {};

    if (status === 404) {
      try {
        await updateStats(query);
        const stats = await fetchStats(query);
        const skipFirstFetch = true;

        return { stats, platform, name, id, skipFirstFetch };
      } catch(err) {
        const { status = 500 } = err.response || {};
        return { stats: null, error: true, status, ...query }
      }
    }
  }
}

export default connect(
  mapStateDynamic(['stats']),
  mapDispatchToProps
)(withRouter(StatsPageContainer));