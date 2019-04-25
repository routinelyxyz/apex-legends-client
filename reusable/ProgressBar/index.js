import css from './style.scss';
import { animated, useSpring, config } from 'react-spring';
import { parsePercent } from '../../util';
import { applyCss } from '../../helpers';

export const ProgressBar = ({
  title,
  hoverTitle = () => '',
  width = 300,
  height = 10,
  delay = 0,
  value,
  className
}) => {
  const percents = parsePercent(value);
  const props = useSpring({
    from: { percents: 0 },
    to: { percents },
    config: config.stiff,
    delay
  });

  return (
    <div
      title={hoverTitle(percents)}
      {...applyCss(
        css.container,
        className
      )}
      style={{ maxWidth: width + 'px' }}
    >
      {title && (
        <span className={css.title}>
          {title}
        </span>
      )}
      <animated.div
        style={{
          height: height + 'px',
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