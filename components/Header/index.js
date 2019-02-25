import css from './style.scss';
import Link from 'next/link';
import { useState } from 'react';

import RouteLink from '../RouteLink';
import Input from '../../reusable/Input';
import { Searcher } from '../../reusable/Searcher';

const Header = () => {
  const [phrase, setPhrase] = useState('');
  const results = [
    { name: 'Ninja' },
    { name: 'Shroud' },
    { name: 'Lirik' }
  ]

  return (
    <header className={css.container}>
      <div className={css.logo}>
        Apex-Legends.win
      </div>
      <nav className={css.header__links}>
        <Link href="/" passHref>
          <RouteLink>Home</RouteLink>
        </Link>
        <Link href="/items" passHref>
          <RouteLink>Items</RouteLink>
        </Link>
        <Link href="/legends" passHref>
          <RouteLink>Legends</RouteLink>
        </Link>
      </nav>
      <div className={css.searcher}>
        <Searcher
          placeholder="Player nickname..."
          value={phrase}
          onChange={e => setPhrase(
            e.target.value
          )}
          results={results}
        />
      </div>
    </header>
  );
}

export default Header;