import Header from '../components/Header';
import css from '../assets/css/index.scss';
// import Transition from 'react-spring/renderprops';
import { useTransition, useSpring, animated } from 'react-spring';

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
      <Header/>
      {pageTransitions.map(({ item, key, props }) => {
        return item === route && (
          <animated.main
            className={css.app_content}
            style={props}
            key={key}
          >
            {children}
          </animated.main>
        )
      })}
    </div>
  )
};

export default MainLayout;