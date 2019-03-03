import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { getTs } from '../../util';

const avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png';

import { ProgressRing } from '../../components/ProgressRing';
import { HorizontalNav } from '../../reusable/HorizontalNav';
import { LegendStats } from '../../components/LegendStats';

const getStats = async () => {
  return { stats: {} }
}

const initialTs = getTs();
const countdown = 300;

const StatsPage = ({ name, url, ...props }) => {
  const [stats, setStats] = useState(() => props.stats.stats);
  const [now, setNow] = useState(() => initialTs);
  const [to, setTo] = useState(() => initialTs + countdown);
  const counter = to - now;

  useEffect(() => {
    let interval = setInterval(() => {
      setNow(getTs());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (counter < 0) {
      getStats()
      .then(({ stats }) => {
        setTo(getTs() + countdown);
      })
      .catch(console.log)
    }
  }, [counter]);

  const lvlProps = useSpring({
    from: { lvl: 0 },
    to: { lvl: stats.lvl },
    delay: 100,
    config: { mass: 1, tension: 150, friction: 50 },
  });

  return (
    <div>
      <div className={css.player}>
        <div className={css.badge}>
          <ProgressRing
            radius={65}
            stroke={7}
            progress={stats.lvlProgress}
          />
          <img
            src={avatar}
            className={css.avatar}
          />
        </div>
        <div>
          <h1 className={css.name}>
            {name} {counter}
          </h1>
          <p className={css.lvl_container}>
            <span className={css.lvl_title}>
              LVL
            </span>
            <animated.span
              className={css.lvl_value}
            >
              {lvlProps.lvl.interpolate(v => v.toFixed())}
            </animated.span>
          </p>
        </div>
      </div>
      <HorizontalNav>
        <Link href={url}>
          Overview
        </Link>
        <Link href={url + '/match-history'}>
          Match History
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
  const url = getUrl(`/stats/${platform}/${encodeURI(name)}?id=${id}`);
  const res = await fetch(url);
  const stats = await res.json();
  return { stats, platform, name, id, url };
}

export default StatsPage;