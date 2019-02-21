import css from './style.scss';
import React from 'react';

export const HorizontalNavLink = ({ children }) => (
  <li className={css.link}>
    {children}
  </li>
);

export const HorizontalNav = ({ children }) => {
  return (
    <nav className={css.nav_container}>
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