import css from './style.scss';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
// const useDevice = dynamic(() => import('../../hooks').useDevice, {
//   ssr: false
// });
import { useDevice } from '../../hooks';

import { PlayerSearcher } from '../PlayerSearcher';
import { NavLink } from '../../reusable/Elements';

export const Header = ({ route }) => {
  return (
    <header className={css.container}>
      <div className={css.logo}>
        Apex-Legends.win
      </div>
      <nav className={css.header__links}>
        <NavLink
          title="Home"
          href="/"
          active={route === '/'}
          prefetch
        />
        <NavLink
          title="Leaderboards"
          href="/leaderboards"
          active={route.startsWith('/leaderboards')}
          prefetch
        />
        <NavLink
          title="Items"
          href="/items"
          active={route.startsWith('/items')}
          prefetch
        />
        <NavLink
          title="Legends"
          href="/legends"
          active={route.startsWith('/legends')}
          prefetch
        />
      </nav>
      <div className={css.searcher}>
        <PlayerSearcher
          height={300}
        />
      </div>
    </header>
  );
}