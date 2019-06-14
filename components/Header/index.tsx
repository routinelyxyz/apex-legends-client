import React from 'react';
import css from './style.scss';
import { useContext } from 'react';
import { applyCss } from '../../helpers';
import { MobileMenuContext } from '../../helpers/context';
import Link from 'next/link';

import { PlayerSearcher } from '../PlayerSearcher';
import { NavLink } from '../../reusable/Elements';

interface HeaderProps {
  route: string
}

const navigationLinks = [
  {
    title: 'Home',
    href: '/',
    icon: 'house',
    active: (route: string) => route === '/'
  },
  {
    title: 'Leaderboards',
    short: 'Lboards',
    href: '/leaderboards',
    icon: 'medal',
    active: (route: string) => route.startsWith('/leaderboards')
  },
  {
    title: 'Items',
    href: '/items',
    icon: 'shotgun',
    active: (route: string) => route.startsWith('/items')
  },
  {
    title: 'Legends',
    href: '/legends',
    icon: 'mask',
    active: (route: string) => route.startsWith('/legends')
  },
  {
    title: 'Stats',
    href: '/stats',
    icon: 'rising',
    active: (route: string) => route.startsWith('/stats')
  }
]

export const Header = ({ route }: HeaderProps) => {
  const mobileMenu = useContext(MobileMenuContext);
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
      <div className={css.searcher}>
        <PlayerSearcher
          height={300}
        />
      </div>
    </header>
  );
}