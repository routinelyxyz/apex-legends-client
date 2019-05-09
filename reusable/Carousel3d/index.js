import React, { useState, useEffect } from 'react';
import css from './style.scss';
import { useSprings, animated } from 'react-spring';

export const CarouselItem = () => (<div></div>);

export const Carousel3d = ({ children, visible = 3, duration = 1000 }) => {
  const childrenArray = React.Children.toArray(children);

  const [active, setActive] = useState(0);
  const [items, setItems] = useState([1, 2, 3]);
  const currentSlide = active % visible;

  const [springs, set, stop] = useSprings(3, index => ({
    opacity: 1,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => prev + 1);
      setItems(prev => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      set(_ => ({ opacity: 1 }))
    }, duration);
    return () => clearInterval(interval);
  }, []);



  return (
    <ul className={css.carousel__container}>
      {springs.map((props, i) => (
        <animated.div style={props} key={i}>
          {i + 1}
        </animated.div>
      ))}
      {/* {items.map(item => item)} */}
    </ul>
  );
}