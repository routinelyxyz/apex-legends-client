import React, { ReactNode } from 'react';
import { animated, useTransition, config } from 'react-spring';

interface SlidingContainerProps {
  state: boolean
  height?: number
  className?: string
  children?: ReactNode
}
export const SlidingContainer = ({
  state,
  height = 250,
  ...rest
}: SlidingContainerProps) => {

  const transitions: any[] = useTransition(state, null, {
    from: { opacity: 0.7, height: 0 },
    enter: { scale: 1, opacity: 1, height },
    leave: { scale: 0, opacity: 0, height: 0 },
    config: config.stiff
  });
  
  return (
    <>
      {transitions.map(({ item, props, key }) => (
        item && (
          <animated.div
            style={{
              opacity: props.opacity,
              height: props.height.interpolate((v: number) => v + 'px'),
            }}
            key={key}
            {...rest}
          />
        )
      ))}
    </>
  );
}