import css from './style.scss';
import { Children, useState } from 'react';
import { animated, useTransition } from 'react-spring';

export const Menu = ({ children }) => {
  const [activeChild, setActiveChild] = useState(0);
  const [toRight, setToRight] = useState(true);
  const [initReveal, setInitReveal] = useState(true);

  const links = [
    'Favorites',
    'Popular',
    'Searcher'
  ]

  const fromTr = toRight ? -100 : 100;
  const leaveTr = toRight ? 100 : -100;

  const transitions = useTransition(activeChild, p => p, {
    from: { opacity: 0, transform: 'translate3d(50%,0,0)', tr: fromTr },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)', tr: 0 },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)', tr: leaveTr, position: 'absolute' },
    // config: { tension: 125, friction: 50, precision: 0.1 },
    config: { mass: .5, tension: 200, friction: 50 },
    immediate: initReveal
  });

  return (
    <div>
      <ul className={css.menu_container}>
        {links.map((title, index) => (
          <li
            className={`${css.menu_item} ${activeChild === index && css.menu_item__active}`}
            onClick={() => {
              setToRight(activeChild > index);
              setActiveChild(index);
              if (setInitReveal) setInitReveal(false);
            }}
            key={index}
          >
            {title}
          </li>
        ))}
      </ul>
      <div className={css.transitions_container}>
        {transitions.map(({ item, props: { tr, opacity, position, ...style }, key }) => {
          return (
            <animated.div
              style={{
                opacity,
                position,
                transform: tr
                  .interpolate(v => `translateX(${v}%)`)
              }}
              className={css.animated_container}
              key={key}
            >
              {children[item]}
            </animated.div>
          )
        })}
      </div>
    </div>
  );
}