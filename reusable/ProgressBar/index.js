import css from './style.scss';
import { animated, useSpring } from 'react-spring';
import { parsePercent } from '../../util';

export const ProgressBar = ({ title, value }) => {
  const percents = parsePercent(value);
  const props = useSpring({
    from: { width: 0 },
    to: { width: percents }
  });

  return (
    <div
      className={css.container}
      title={`Better than ${percents}% weapons`}
    >
      {title && (
        <span className={css.title}>
          {title}
        </span>
      )}
      <animated.div
        style={{
          width: props.width.interpolate(p => p + '%'),
          opacity: props.width
            .interpolate({ range: [25, 50, 100], output: [0.25, 0.4, 1] })
        }}
        className={css.bar}
      >
      </animated.div>
    </div>
  )
}