import Header from '../components/Header';
import css from '../assets/css/index.scss';
// import Transition from 'react-spring/renderprops';
import { useTransition, useSpring, animated } from 'react-spring';

const MainLayout = ({ children, route }) => {
  const pageTransitions = useTransition(route, null, {
    from: { opacity: 0, position: 'absolute' }, // transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' }
  });

  return (
    <div className={css.app_container}>
      <Header/>
      <main className={css.app_content}>
        {children}
      </main>
    </div>
  )

  return (
    <div className={css.app_container}>
      <Header/>
      <Transition
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
        keys={route}
      >
        {style => (
          <animated.main
            style={style}
            className={css.app_content}
          >
            {children}
          </animated.main>
        )}
      </Transition>
    </div>
  )

  return (
    <div className={css.app_container}>
      <Header/>
      
      {pageTransitions.map(({ item, key, props }) => 
        route === item && (
        <animated.main
          style={props}
          className={css.app_content}
          key={route}
        >
          {children}
        </animated.main>
      )
      )}
    </div>
  )
};

export default MainLayout;