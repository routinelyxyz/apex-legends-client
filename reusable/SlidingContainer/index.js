import React from 'react';
import { animated, useTransition, config } from 'react-spring';

const SlidingContainer = ({ state, height = 250, ...rest }) => {

  const transitions = useTransition(state, null, {
    from: { opacity: 0.7, height: 0 },
    enter: { scale: 1, opacity: 1, height },
    leave: { scale: 0, opacity: 0, height: 0 },
    config: config.stiff
  });
  
  return transitions.map(({ item, props, key }) => (
    item && (
      <animated.div
        style={{
          opacity: props.opacity,
          height: props.height
            .interpolate(v => v + 'px'),
        }}
        key={key}
        {...rest}
      />
    )
  ));
}

const Memoized = React.memo(SlidingContainer);
export { Memoized as SlidingContainer };