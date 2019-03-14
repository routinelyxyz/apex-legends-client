import Link from 'next/link';
import css from './style.scss';
import { animated, useTransition } from 'react-spring';
import { useRef, useEffect, useState } from 'react';
import { useMeasure, useMounted } from '../../hooks';
 
import Item from '../../reusable/Item';


export const WeaponsGrid = ({ items }) => {
  const [refs, setRefs] = useState({});
  const itemRef = useRef();
  const [first, setFirst] = useState();
  const [deltaXX, setDeltaX] = useState(0);
  const afterInitialRender = useMounted();

  const [deltaY, setDeltaY] = useState(0);

  const transitions = useTransition(items, item => item.id, {
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { position: 'absolute', transform: 'scale(0)', opacity: 0 },
    immediate: !afterInitialRender
  });

  useEffect(() => {
    // const first = itemRef.current.getBoundingClientRect();
    // setFirst(first);
    // setDeltaX(first.left);
    // setDeltaY(first.top);    
  }, []);

  useEffect(() => {
    if (!first) return;
    const last = itemRef.current.getBoundingClientRect();

    setDeltaX(first.left - last.left);
    setDeltaY(first.top - last.top);

  }, [items]);

  return (
    <div className={css.container}>
      {transitions.map(({ item, props: { deltaXX, ...rest }, key }) =>
        <Link
          key={key}
          href={`/items/weapon?slug=${item.slug}`}
          as={`/items/weapon/${item.slug}`}
          passHref
        > 
          <animated.div
            style={{
              ...rest,
              // transform: deltaXX
                // .interpolate(v => `translateX(${v}px)`)
                // .interpolate(v => `translateX(${v}px, ${props.deltaY}px)`)
            }}
          >
            <Item
              item={item}
            />
          </animated.div>
        </Link>
      )}
    </div>
  )
}