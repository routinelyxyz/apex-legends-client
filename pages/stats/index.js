import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl, getStatic, getAvatar } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTs } from '../../util';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateDynamic } from '../../store/mappers';
import Head from 'next/head';
import axios from 'axios';
import { withRouter } from 'next/router';
import { useFirstRender } from '../../hooks';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNavTab } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';
import { StatsBanner } from '../../components/StatsBanner';
import { StatsHistory } from '../../components/StatsHistory';
import { PlayerSearcher } from '../../components/PlayerSearcher';


const getStats = async (player, update = false) => {
  const { platform, name, id = '' } = player;

  const url = `/stats/${platform}/${encodeURI(name)}?id=${id}&update=${update}`;
  const stats = await axios.get(url);
  
  return stats.data.data;
}

const initialTs = getTs();
// const countdown = 178;
const countdown = 10;

const StatsPage = ({ name, url, platform, empty, error, status, router, ...props }) => {
  if (!props.stats || error) return (
    <div className={css.searcher}>
      <PlayerSearcher pageMode/>
      {error && (
        <>
          <p>{status === 404
            ? `Player with name (${name}) doesn't exist on platform - ${platform}.` 
            : `Server error. Please try again after few minutes.` 
          }</p>
        </>
      )}
    </div>
  );
  const afterFirstRender = useFirstRender();
  const [stats, setStats] = useState(() => props.stats);
  const [now, setNow] = useState(() => initialTs);
  const [to, setTo] = useState(() => initialTs - 1);
  const [isUpdating, setUpdating] = useState(false);
  const counter = to - now;

  const updateStats = (player = stats.player) => {
    if (isUpdating) return;
    setUpdating(true);

    return getStats(player, true)
      .then(nextStats => {
        if (router.query.name === stats.player.name) {
          setStats(nextStats);
        }
        setTo(getTs() + countdown);
        setUpdating(false);
      })
      .catch(console.log);
  }

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);

    if (stats && !error) {
      if (afterFirstRender) {
        setStats(props.stats);
        setTo(getTs() + countdown);
        props.actions.savePlayerAsync(props.stats.player);
      } else {
        props.actions.savePlayerAsync(stats.player);
      }
    }

    return () => clearInterval(interval);
  }, [props.stats, afterFirstRender]);

  useEffect(() => {
    if (counter < 0 && !isUpdating) {
      updateStats();
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
    to: { lvl: stats.lvl },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 },
  });

  return (
    <div>
      <Head>
        <title>{stats.name} - Stats | Apex-Legends.win</title>
      </Head>
      <div className={css.player}>
        <div className={css.badge}>
          <ProgressRing
            radius={73}
            stroke={7}
            progress={stats.lvlProgress}
          />
          <div className={css.avatar_container}>
            <img
              src={getAvatar(stats.player)}
              className={css.avatar}
            />
          </div>
        </div>
        <div>
          <h1 className={css.name}>
            {stats.name || stats.player.name}
          </h1>
          <p className={css.lvl_container}>
            <animated.span className={css.lvl_value}>
              {lvlProps.lvl.interpolate(v => v.toFixed())}
            </animated.span>
          </p>
          <div
            onClick={() => props.actions.savePlayerAsync(
              stats, 'favorite'
            )}
          >Add to fav</div>
        </div>
        <div className={css.update_container}>
          <p className={css.update_title}>
            Update in:
          </p>
          {updateIn}
        </div>
      </div>
      <HorizontalNavTab
        withMargin
        tabs={[
          {
            title: 'Overview',
            content: (
              <>
                {stats.legends.map(legendStats => (
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
            content: <StatsHistory player={stats.player || stats}/>
          },
          /*
          {
            title: 'Banner',
            content: <StatsBanner playerId={stats.id || stats.player.id}/>
          }
          */
        ]}
      >
      </HorizontalNavTab>
    </div>
  )
}

StatsPage.getInitialProps = async ({ query: { platform, name, id = '' }}) => {
  try {
    if ((!name || !platform) && !id) {
      return { stats: null };
    }
    
    const res = await axios.get(`/stats/${platform}/${encodeURIComponent(name)}?id=${id}`);
    const stats = res.data.data;

    return { stats, platform, name, id, url: '' };
  
  } catch (err) {
    const { status } = err.response ? err.response : 500;
    return { stats: null, platform, name, error: true, status };
  }
}

export default connect(
  mapStateDynamic(['stats']),
  mapDispatchToProps
)(withRouter(StatsPage));