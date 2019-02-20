import css from './style.scss';
import Link from 'next/link';
import styled from 'styled-components';

const Header = () => (
  <header className={css.header__container}>
    <nav className={css.header__links}>
      <Link href="/">
        <StyledLink>Home</StyledLink>
      </Link>
      <Link href="/items">
        <StyledLink>Items</StyledLink>
      </Link>
    </nav>
  </header>
);

const StyledLink = styled.a`
  font-size: 16px;
  display: block;
  cursor: pointer;
  font-weight: 400;
`

export default Header;