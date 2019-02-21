import ItemsLayout from '../../../layouts/items';
import 'isomorphic-unfetch';
import css from './style.scss';
import { weaponProps } from '../../../helpers';
import Link from 'next/link';

import { HorizontalNav } from '../../../reusable/HorizontalNav';

const WeaponPage = ({ slug, item }) => {
  return (
    <ItemsLayout>
      <div className={css.header}>
        <div>
          <h1 className={css.heading}>
            {item.name}
          </h1>
          <p className={css.item_category}>
            {item.type}
          </p>
        </div>
        <figure className={css.img_container}>
          <img
            src="/static/VK-47 Flatline.png"
            className={css.item_img}
          />
        </figure>
      </div>
      <HorizontalNav>
        <Link href={`/items/weapons/${slug}`}>
          Overview
        </Link>
      </HorizontalNav>
      <article>
        <ul className={css.props_list}>
          {weaponProps.map(([prop, name]) => (
            <li
              key={prop}
              className={css.prop_row}
            >
              <span className={css.prop_name}>
                {name}
              </span>
              <span className={css.prop_value}>
                {item[prop]}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </ItemsLayout>
  )
}

WeaponPage.getInitialProps = async ({ query: { slug }}) => {
  const data = await fetch(`http://localhost:4000/items/weapon/${slug}`);
  const item = await data.json();
  return { slug, item };
}

export default WeaponPage;

