import css from './style.scss';
import Link from 'next/link';
import { applyCss } from '../../helpers';


export const H3 = ({ children }) => (
  <h3 className={css.h3}>
    {children}
  </h3>
);

export const NavLink = ({
  href, as, active,
  className, children,
  title = children
}) => (
  <Link
    as={as}
    href={href}
  >
    <a
      {...applyCss(
        css.navlink,
        active && css.active
      )}
    >{title}</a>
  </Link>
);