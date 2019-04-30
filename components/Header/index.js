import css from './style.scss';
import { useState, useRef, useEffect, useContext } from 'react';
import { useDevice, useWindowSize } from '../../hooks';
import { applyCss } from '../../helpers';
import { MobileMenuContext } from '../../helpers/context';
import Link from 'next/link';

import { PlayerSearcher } from '../PlayerSearcher';
import { NavLink } from '../../reusable/Elements';

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

export const Header = ({ route, asPath }) => {
  const mobileMenu = useContext(MobileMenuContext);
  const isStatsPage = asPath.includes('/stats/');

  return (
    <header className={css.container}>
      <Link href="/">
        <a className={css.logo}>
          <img src="/static/img/logo.png" />
        </a>
      </Link>
      <nav
        {...applyCss(
          css.header_nav,
          !mobileMenu.visible && css.hidden
        )}
      >
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
      <div 
        {...applyCss(
          css.searcher,
          isStatsPage && css.searcher_stats
        )}
      >
        <PlayerSearcher
          height={300}
        />
      </div>
    </header>
  );
}