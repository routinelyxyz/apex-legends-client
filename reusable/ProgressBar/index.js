import css from './style.scss';
import { useEffect } from 'react';
import { animated, useSpring } from 'react-spring';

export const ProgressBar = ({ title, value }) => {
  const props = useSpring({
    from: { width: 0 },
    to: { width: value }
  });

  return (
    <div className={css.container}>
      <animated.div
        style={{
          maxWidth: 300,
          ...props
        }}
        className={css.bar}
      >
      </animated.div>
    </div>
  )
}