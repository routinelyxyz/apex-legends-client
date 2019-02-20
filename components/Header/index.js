import css from './style.scss';
import Link from 'next/link';
import styled from 'styled-components';

import RouteLink from '../RouteLink';
import Input from '../../reusable/Input';

const Header = () => (
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
    </nav>
    <div className={css.searcher}>
      <Input
        placeholder="Player nickname..."
      />
    </div>
  </header>
);

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export default Header;