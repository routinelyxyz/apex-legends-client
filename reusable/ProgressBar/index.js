import css from './style.scss';
import { animated, useSpring, config } from 'react-spring';
import { parsePercent } from '../../util';

export const ProgressBar = ({ title, hoverTitle = () => '', value }) => {
  const percents = parsePercent(value);
  const props = useSpring({
    from: { percents: 0 },
    to: { percents },
    config: config.stiff
  });

  return (
    <div
      className={css.container}
      title={hoverTitle(percents)}
    >
      {title && (
        <span className={css.title}>
          {title}
        </span>
      )}
      <animated.div
        style={{
          width: props.percents.interpolate(p => p + '%'),
          opacity: props.percents
            .interpolate({ range: [25, 100], output: [0.65, 1] })
        }}
        className={css.bar}
      >
      </animated.div>
    </div>
  )
}