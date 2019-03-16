import css from './style.scss';
import { useState, useEffect } from 'react';
import { useDevice, useWindowSize } from '../../hooks';
import { applyCss } from '../../helpers';

import { PlayerSearcher } from '../PlayerSearcher';
import { NavLink } from '../../reusable/Elements';
import { HeaderSearcher } from '../HeaderSearcher';
import { TabNavigator } from '../TabNavigator';

const navigationLinks = [
  {
    title: 'Home',
    href: '/',
    icon: 'house',
    active: route => route === '/'
  },
  {
    title: 'Leaderboards',
    short: 'Lboards',
    href: '/leaderboards',
    icon: 'medal',
    active: route => route.startsWith('/leaderboards')
  },
  {
    title: 'Items',
    href: '/items',
    icon: 'shotgun',
    active: route => route.startsWith('/items')
  },
  {
    title: 'Legends',
    href: '/legends',
    icon: 'mask',
    active: route => route.startsWith('/legends')
  },
  {
    title: 'Stats',
    href: '/stats',
    icon: 'rising',
    active: route => route.startsWith('/stats')
  }
]


export const Header = ({ route }) => {
  const [op, setOp] = useState(true);
  const [phrase, setPhrase] = useState('');

  return (
    <header className={css.container}>
      <button
        className={css.btn}
        onClick={() => setOp(!op)}
      >
        <img src="/static/img/loupe.svg"/>
      </button>
      {op && (
        <TabNavigator
          pages={[
            {
              id: 'Home',
              header: 'Main page',
              content: (({ goTo }) => (
                <>
                  Ctx1`
                  <a onClick={() => goTo('Home/Settings')}>
                    Go to settings
                  </a>
                </>
              )),
              children: [
                {
                  id: 'Settings',
                  content: ({ goTo }) => (
                    <>
                      <a onClick={() => goTo('Home')}>
                        Go to Home
                      </a>
                    </>
                  ),
                  children: [{ id: 'Account', content: 'ABC' }]
                }
              ]
            }
          ]}
        />
      )}
      {/* <HeaderSearcher/> */}
      <div className={css.logo}>
        Apex-Legends.win
      </div>
      <nav className={css.header_nav}>
        {navigationLinks.map(({ title, href, active, short, icon }) => {
          const isActive = active(route);
          return (
            <NavLink
              key={title}
              {...applyCss(
                css.phone_btn,
                isActive && css.active
              )}
              href={href}
              active={isActive}
              prefetch
            >
              <>
                <img
                  className={css.icon}
                  src={`/static/img/${icon}.svg`}
                />
                <span {...applyCss(css.title, css.title_long)}>
                  {title}
                </span>
                <span  {...applyCss(css.title, css.title_short)}>
                  {short ? short : title}
                </span>
              </>
            </NavLink>
          );
        })}
      </nav>
      <div className={css.searcher}>
        <PlayerSearcher
          height={300}
        />
      </div>
    </header>
  );
}