import React, { ReactNode, ReactElement } from 'react';
import css from './style.scss';
import { LinkProps } from 'next/link';
import { applyCss } from '../../helpers';

export const H3 = () => (<h3 className={css.h3} />);

interface NavLinkProps extends LinkProps {
  href: string
  as: string
  active?: boolean
  className?: string
  children: ReactElement
  title: ReactNode
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