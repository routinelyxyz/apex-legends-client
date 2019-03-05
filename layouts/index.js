import css from '../assets/css/index.scss';
import dynamic from 'next/dynamic';
import React from 'react';
import { useTransition, useSpring, animated } from 'react-spring';

import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

// const ItemsLayout = dynamic(() => import('./items'));
import ItemsLayout from './items';

const MainLayout = ({ children, route }) => {

  const pageTransitions = useTransition(route, r => r, {
    // from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    // enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    // leave: { opacity: 0, transform: 'translate3d(-50%,0,0)', position: 'absolute' },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <div className={css.app_container}>
      <Header route={route}/>
      <main className={css.app_content}>
        {route.startsWith('/items')
          ? <ItemsLayout
              children={children}
              route={route}
            />
          : children
        }
      </main>
      {/* <Footer/> */}
    </div>
  )

  return (
    <div className={css.app_container}>
      <Header/>
      {pageTransitions.map(({ item, key, props }) => {
        return item === route && (
          <animated.main
            className={css.app_content}
            style={props}
            key={key}
          >
            {/* {route.includes('/items')
              ? <ItemsLayout
                  children={children}
                  route={route}
                />
              : children
            } */}
          </animated.main>
        )
      })}
    </div>
  )
};

export default MainLayout;