import 'isomorphic-unfetch';
import css from './style.scss';
import { getUrl } from '../../helpers';
import { animated, useSpring, config } from 'react-spring';

const avatar = 'https://static-cdn.jtvnw.net/jtv_user_pictures/cef31105-8a6e-4211-a74b-2f0bbd9791fb-profile_image-70x70.png';

import { ProgressRing } from '../../components/ProgressRing';


const StatsPage = ({ name, stats: { stats }}) => {
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
            {name}
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
    </div>
  )
}

StatsPage.getInitialProps = async ({ query: { platform, name, id }}) => {
  const res = await fetch(
    getUrl(`/stats/${platform}/${encodeURI(name)}?id=${id}`)
  );
  const stats = await res.json();
  return { stats, platform, name, id };
}

export default StatsPage;