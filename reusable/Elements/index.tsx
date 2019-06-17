import React, { ReactNode } from 'react';
import css from './style.scss';
import Link from 'next/link';
import { applyCss } from '../../helpers';
import { UrlLike } from 'next/router';

interface H3Props {
  children: ReactNode
}
export const H3 = (_props: H3Props) => (
  <h3 className={css.h3} />
);

interface NavLinkProps {
  active?: boolean
  className?: string
  children?: ReactNode
  title?: ReactNode

  prefetch?: boolean
  shallow?: boolean
  scroll?: boolean
  replace?: boolean
  onError?(error: any): void
  href?: string | UrlLike
  as?: string | UrlLike
  passHref?: boolean
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