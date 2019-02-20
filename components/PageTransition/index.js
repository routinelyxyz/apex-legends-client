import { useEffect } from 'react';
import { useTransition, useSpring, animated } from 'react-spring';

export const PageTransition = ({ route, children }) => {

  const pageTransitions = useTransition(route, null, {
    from: { opacity: 0, position: 'absolute' }, // transform: 'scale(0)' },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  // const [props] = useSpring({ opacity: });

  return (
    pageTransitions.map(({ item, key, props }) => 
      <animated.div style={props}>
        {children}
      </animated.div>
    )
  );
}