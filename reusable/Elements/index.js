import css from './style.scss';
import Link from 'next/link';
import { applyCss } from '../../helpers';


export const H3 = () => <h3 className={css.h3} />;

export const NavLink = ({
  href, as, active,
  className, children,
  title = children,
  ...linkProps
}) => (
  <Link
    as={as}
    href={href}
    {...linkProps}
  >
    <a
      {...applyCss(
        css.navlink,
        active && css.active,
        className
      )}
    >{title}</a>
  </Link>
);