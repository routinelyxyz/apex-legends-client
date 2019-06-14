import React, { ReactChildren } from 'react';
import css from './style.scss';
import Link from 'next/link';
import { applyCss } from '../../helpers';

export const H3 = <h3 className={css.h3} />;

interface NavLinkProps extends Link {
  href: string
  as: string
  active?: boolean
  className?: string
  children: JSX.Element
  title: string | JSX.Element
}

export const NavLink = ({
  href,
  as,
  active,
  className,
  children,
  title = children,
  ...linkProps
}: NavLinkProps) => (
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