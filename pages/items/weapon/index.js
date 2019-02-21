import ItemsLayout from '../../../layouts/items';
import 'isomorphic-unfetch';
import css from './style.scss';
import { STATIC, weaponProps, ammoNames } from '../../../helpers';
import Link from 'next/link';

import { HorizontalNav } from '../../../reusable/HorizontalNav';

const WeaponPage = ({ slug, item }) => {
  const ammoName = ammoNames[item.ammo.name] || item.ammo.name;
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
          <p className={css.ammo_type}>
            {ammoName}
          </p>
          <img
            alt={`Apex Legends ${item.ammo.name} ammo`}
            title={ammoName}
            src={STATIC + item.ammo.img}
          />
        </div>
        <figure className={css.img_container}>
          <img
            src={STATIC + item.img}
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

