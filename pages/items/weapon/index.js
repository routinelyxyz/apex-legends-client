import ItemsLayout from '../../../layouts/items';
import 'isomorphic-unfetch';
import css from './style.scss';
import { useMemo } from 'react';
import { STATIC, weaponProps, ammoNames, HOST_URL, weaponPropTitles } from '../../../helpers';
import Link from 'next/link';
import { round } from '../../../util';

import { HorizontalNav } from '../../../reusable/HorizontalNav';
import { ProgressBar } from '../../../reusable/ProgressBar';

const WeaponPage = ({ slug, avgValues, item }) => {
  const ratioValues = useMemo(() =>
    Object
      .entries(avgValues)
      .map(([prop, val]) => ({
        name: prop,
        value: Math.round(item[prop] / val * 100)
      }))
  , [avgValues]);

  const ammoName = ammoNames[item.ammo.name] || item.ammo.name;
  
  return (
    <ItemsLayout>
      <div className={css.header}>
        <div>
          <h1 className={css.heading}>
            {item.name}
          </h1>
          <p className={css.item_category}>
            <Link href={{ pathname: `/items`, query: { category: item.type }}}>
              <a className={css.category_link}>
                {item.type}
              </a>
            </Link>
          </p>
          <div className={css.ammo_container}>
            <p className={css.ammo_type}>
              {ammoName}
            </p>
            <Link
              href={`/items?ammo=${item.ammo.name}`}
            >
              <a>
                <img
                  alt={`Apex Legends ${item.ammo.name} ammo`}
                  title={ammoName}
                  src={STATIC + item.ammo.img}
                />
              </a>
            </Link>
          </div>
          <div className={css.stats_bars}>
            {ratioValues.map(({ name, value }) => (
              <ProgressBar
                title={weaponPropTitles[name]}
                value={value}
                key={name}
              />
            ))}
          </div>
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
  const [itemData, avgData] = await Promise.all([
    fetch(`${HOST_URL}/items/weapon/${slug}`),
    fetch(`${HOST_URL}/items/weapons/avg`)
  ]);
  const [item, avgValues] = await Promise.all([
    itemData.json(),
    avgData.json()
  ]);
  return { item, avgValues, slug };
}

export default WeaponPage;

