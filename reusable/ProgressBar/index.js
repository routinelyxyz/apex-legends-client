import css from './style.scss';
import { animated, useSpring, config } from 'react-spring';
import { parsePercent } from '../../util';
import { applyCss } from '../../helpers';

export const ProgressBar = ({ title, hoverTitle = () => '', value, className }) => {
  const percents = parsePercent(value);
  const props = useSpring({
    from: { percents: 0 },
    to: { percents },
    config: config.stiff
  });

  return (
    <div
      title={hoverTitle(percents)}
      {...applyCss(
        css.container,
        className
      )}
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