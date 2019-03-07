import css from './style.scss';
import React from 'react';

import { NavLink } from '../../reusable/Elements';

const ItemsLayout = ({ children, route = '' }) => {
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
        {/* <NavLink
          href="/items/attachments"
          title="Attachments"
          active={route === '/items/attachments'}
        /> */}
      </nav>
      {children}
    </article>
  )
}


export default ItemsLayout;