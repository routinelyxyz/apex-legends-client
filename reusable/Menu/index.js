import css from './style.scss';
import { Children, useState } from 'react';

export const Menu = ({ children,  }) => {
  const [activeChild, setActiveChild] = useState(0);

  const links = [
    'Favorites',
    'Popular'
  ]

  return (
    <div>
      <ul className={css.menu_container}>
        {links.map((title, index) => (
          <li
            className={`${css.menu_item} ${activeChild === index && css.menu_item__active}`}
            onClick={() => setActiveChild(index)}
            key={index}
          >
            {title}
          </li>
        ))}
      </ul>
      {children && children.map((child, index) =>
        activeChild === index && child)
      }
    </div>
  );
}