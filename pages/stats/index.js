import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTs } from '../../util';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateDynamic } from '../../store/mappers';
import Head from 'next/head';

const avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNav } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';

const getStats = async ({ platform, name, id = '' }) => {
  const url = getUrl(`/stats/${platform}/${encodeURI(name)}?id=${id}`);
  const res = await fetch(url);
  const stats = await res.json();
  return { stats: stats.stats };
}

const initialTs = getTs();
const countdown = 179;

const StatsPage = ({ name, url, ...props }) => {
  if (!props.stats) return <div>Player not found</div>
  const [stats, setStats] = useState(() => props.stats.stats);
  const [now, setNow] = useState(() => initialTs);
  const [to, setTo] = useState(() => initialTs + countdown);
  const [isUpdating, setUpdating] = useState(false);
  const counter = to - now;

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);

    props.actions.savePlayerAsync(stats);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter < 0) {
      const { platform, name, id } = stats;

      if (isUpdating) return;
      setUpdating(true);

      getStats(stats)
      .then(({ stats }) => {
        setStats(stats);
        setTo(getTs() + countdown);
        setUpdating(false);
      })
      .catch(console.log)
    }
  }, [counter]);

  const updateIn = () => {
    const seconds = counter % 60;
    const minutes = Math.floor(counter / 60);
    if (minutes <= 0 && seconds <= 0) return 'Just now';
    return (minutes && `${minutes} min. ` || '') + `${seconds} sec.`;
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
            {stats.name}
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
      <HorizontalNav>
        <Link href={url}>
          <a>Overview</a>
        </Link>
        <Link href={url + '/match-history'}>
          <a>Match History</a>
        </Link>
      </HorizontalNav>
      {stats.legends.map(legendStats => (
        <LegendStats
          stats={legendStats}
          key={legendStats.id}
        />
      ))}
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