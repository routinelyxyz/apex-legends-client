import css from './style.scss';
import React from 'react';
import { applyCss } from '../../util';
import Link from 'next/link';
import { withRouter } from 'next/router';

export const HorizontalNavLink = ({ children }) => (
  <li className={css.link}>
    {children}
  </li>
);

export const HorizontalNav = ({ children, className }) => {
  return (
    <nav className={[css.nav_container, className].join(' ')}>
      <ul className={css.nav_list}>
        {React.Children.map(children, (child, index) => (
          <HorizontalNavLink key={index}>
            {child}
          </HorizontalNavLink>
        ))}
      </ul>
    </nav>
  )
}

export const StaticLink = ({ active, title, ...linkProps }) => {
  <Link
    {...linkProps}
  >
    <a
      {...applyCss(
        css.link,
        active(router.route) && css.active
      )}
    >
      {title}
    </a>
  </Link>
}

const HorizontalNav2 = ({ className, children, links, router }) => (
  <nav
    {...applyCss(
      css.nav_container,
      className
    )}
  >
    <ul className={css.nav_list}>
      {children && React.Children.map(children, (LinkComp, index) =>
        <LinkComp key={index}/>
      )}
      {links && links.map(({ title, active, dynamic, ...linkProps }, index) => (
        <li key={index}>
          <Link
            {...linkProps}
            {...dynamic(router)}
          >
            <a {...applyCss(css.link, active(router.route) && css.active)}>
              {title}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

const NavWithRouter = withRouter(HorizontalNav2);

export { NavWithRouter as HorizontalNav2 };