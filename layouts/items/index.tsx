import React, { ReactNode } from 'react';
import css from './style.scss';

import { NavLink } from '../../reusable/NavLink';

interface ItemsLayoutProps {
  children: ReactNode
  route: string
}
export const ItemsLayout = ({ children, route = '' }: ItemsLayoutProps) => {
  return (
    <article>
      <nav className={css.nav_menu}>
        <NavLink
          href="/items"
          title="Weapons"
          active={
            route === '/items' ||
            route.includes('/items?') ||
            route.includes('/items/weapon')
          }
        />
      </nav>
      {children}
    </article>
  )
}


export default ItemsLayout;