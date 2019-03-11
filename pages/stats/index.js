import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTs } from '../../util';
import { fetchify } from '../../util/fetchify';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateDynamic } from '../../store/mappers';
import Head from 'next/head';

const avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNav, HorizontalNav2, StaticLink, HorizontalNavTab } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';
import { StatsBanner } from '../../components/StatsBanner';
import { StatsHistory } from '../../components/StatsHistory';

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
  { title: 'Overview', content: <div>xd</div> },
  { title: 'Match history', content: <div>12312321</div> },
]

const getStats = async (player, update = false) => {
  const { platform, name, id = '' } = player;
  const url = `/stats/${platform}/${encodeURI(name)}?id=${id}&update=${update}`;

  const res = await fetchify.get(url);
  return await res.json();
}

const initialTs = getTs();
const countdown = 178;

const StatsPage = ({ name, url, platform, ...props }) => {
  if (!props.stats) return <div>Player not found</div>
  const [stats, setStats] = useState(() => props.stats.stats);
  const [now, setNow] = useState(() => initialTs);
  const [to, setTo] = useState(() => initialTs - 1);
  const [isUpdating, setUpdating] = useState(false);
  const counter = to - now;
  const histUrl = `/stats/${platform}/${encodeURI(name)}/history`;
  const as = `/stats?platform=${platform}&name=${encodeURI(name)}&id=${stats.player && stats.player.id}/history`;
  // const historyUrl = `/stats/history/${platform}/${encodeURI(name)}?id=${stats.player.id}`;

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);
    props.actions.savePlayerAsync(stats);

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
      .then(({ stats: data }) => {
        setStats(data);
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

  const updateIn = () => {
    const seconds = counter % 60;
    const minutes = Math.floor(counter / 60);
    if ((minutes <= 0 && seconds <= 0) || isUpdating) return 'Just now';
    return (minutes ? `${minutes} min. ` : '') + `${seconds} sec.`;
  }

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
              src={avatar}
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
          {updateIn()}
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
    const url = getUrl(`/stats/${platform}/${encodeURI(name)}?id=${id}`);
    const res = await fetch(url);
    const stats = await res.json();
    return { stats, platform, name, id, url };
  } catch (err) {
    return { stats: null, platform, name, err };
  }
}

export default connect(
  mapStateDynamic(['stats']),
  mapDispatchToProps
)(StatsPage);