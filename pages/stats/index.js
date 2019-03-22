import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl, getStatic, getAvatar } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTs } from '../../util';
import { fetchify } from '../../util/fetchify';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateDynamic } from '../../store/mappers';
import Head from 'next/head';
import axios from 'axios';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNav, HorizontalNav2, StaticLink, HorizontalNavTab } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';
import { StatsBanner } from '../../components/StatsBanner';
import { StatsHistory } from '../../components/StatsHistory';
import { PlayerSearcher } from '../../components/PlayerSearcher';

const links = [
  {
    title: 'Overview',
    active: r => !r.includes('/history'),
    dynamic: ({ asPath = '' }) => ({
      href: asPath,
      as: asPath
    }),
  },
  {
    title: 'Match History',
    active: r => r.includes('/history'),
    dynamic: ({ asPath = '' }) => ({
      href: asPath,
      as: asPath
    })
  }
];

const tabs = [
  { title: 'Overview', content: <div>abc</div> },
  { title: 'Match history', content: <div>def</div> },
]

const getStats = async (player, update = false) => {
  const { platform, name, id = '' } = player;

  const url = `/stats/${platform}/${encodeURI(name)}?id=${id}&update=${update}`;
  const stats = await axios.get(url);
  
  return stats.data.data;
}

const initialTs = getTs();
// const countdown = 178;
const countdown = 10;

const StatsPage = ({ name, url, platform, empty, error, status, ...props }) => {
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
  const [stats, setStats] = useState(() => props.stats);
  const [now, setNow] = useState(() => initialTs);
  const [to, setTo] = useState(() => initialTs - 1);
  const [isUpdating, setUpdating] = useState(false);
  const counter = to - now;

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);
    if (stats && !error) {
      props.actions.savePlayerAsync(stats.player);
    }

    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    if (isUpdating) return;
    setUpdating(true);

    /*
      Normalize ENDPOINT stats object after update
      + Add used props to test
    */
    getStats(stats.player, true)
      .then(nextStats => {
        setStats(nextStats);
        setTo(getTs() + countdown);
        setUpdating(false);
      })
      .catch(console.log)
  }

  useEffect(() => {
    if (counter < 0) {
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
      {/* <HorizontalNav>
        <Link href={url}>
          <a>Overview</a>
        </Link>
        <Link
          href={histUrl}
          as={as}
        >
          <a>Match History</a>
        </Link>
      </HorizontalNav> */}
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
        {/* {(tab, index) => (
          <div>{tab} {index}</div>
        )} */}
      </HorizontalNavTab>
      {/* <HorizontalNav2>
        <StaticLink
          title="Match history"
          href={url}
          as={url}
        />
        <StaticLink
          title="Match history"
          href={historyUrl}
          as={historyUrl}
        />
      </HorizontalNav2> */}
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
)(StatsPage);