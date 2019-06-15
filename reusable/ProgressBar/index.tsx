import React from 'react';
import css from './style.scss';
import { animated, useSpring, config } from 'react-spring';
import { parsePercent } from '../../util';
import { applyCss } from '../../helpers';

interface ProgressBarProps {
  title?: string
  hoverTitle?: (percents: number) => string
  width?: number
  height?: number
  delay?: number
  value: number
  className?: string
}
export const ProgressBar = ({
  title,
  hoverTitle = () => '',
  width = 300,
  height = 10,
  delay = 0,
  value,
  className
}: ProgressBarProps) => {
  
  const percents: any = parsePercent(value);
  const props: any = useSpring({
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
        className={css.bar}
        style={{
          height: height + 'px',
          width: props.percents.interpolate((p: number) => p + '%'),
          opacity: props.percents
            .interpolate({ range: [25, 100], output: [0.65, 1] })
        }}
      >
      </animated.div>
    </div>
  )
}