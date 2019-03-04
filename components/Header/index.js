import css from './style.scss';
import Link from 'next/link';
import RouteLink from '../RouteLink';

import { PlayerSearcher } from '../PlayerSearcher';

const Header = () => {
  return (
    <header className={css.container}>
      <div className={css.logo}>
        Apex-Legends.win
      </div>
      <nav className={css.header__links}>
        <Link href="/" passHref>
          <RouteLink>Home</RouteLink>
        </Link>
        <Link href="/leaderboards" passHref>
          <RouteLink>Leaderboards</RouteLink>
        </Link>
        <Link href="/items" passHref>
          <RouteLink>Items</RouteLink>
        </Link>
        <Link href="/legends" passHref>
          <RouteLink>Legends</RouteLink>
        </Link>
      </nav>
      <div className={css.searcher}>
        <PlayerSearcher
          height={300}
        />
      </div>
    </header>
  );
}

export default Header;