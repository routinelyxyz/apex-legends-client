import css from './style.scss';
import Link from 'next/link';

const Header = () => (
  <header className={css.header__container}>
    <nav className={css.header__links}>
      <Link href="/">Home</Link>
      <Link href="/items">Items</Link>
    </nav>
  </header>
);

export default Header;