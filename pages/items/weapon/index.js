import 'isomorphic-unfetch';
import css from './style.scss';
import { useMemo } from 'react';
import { weaponProps, getUrl, ammoNames, weaponPropTitles, getStatic } from '../../../helpers';
import Link from 'next/link';

import { HorizontalNav } from '../../../reusable/HorizontalNav';
import { ProgressBar } from '../../../reusable/ProgressBar';

const WeaponPage = ({ slug, item, ratios }) => {

  const calcedRatio = useMemo(() => ratios
    .map(({ name, min, diff }) => {
      const valOutMin = item[name] - min;
      let value = Math.round(
        name === 'reload' || name === 'emptyReload'
          ? diff / valOutMin
          : valOutMin / diff
      * 100);
      if (value < 5) value = 5;
      return { name, value }
    })
  , []);

  const ammoName = ammoNames[item.ammo.name] || item.ammo.name;
  
  return (
    <div>
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
                  src={getStatic(item.ammo.img)}
                />
              </a>
            </Link>
          </div>
          <div className={css.stats_bars}>
            {calcedRatio.map(({ name, value }) => (
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
            src={getStatic(item.img)}
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
    </div>
  )
}

WeaponPage.getInitialProps = async ({ query: { slug }}) => {
  const [itemData, ratiosData] = await Promise.all([
    fetch(getUrl(`/items/weapon/${slug}`)),
    fetch(getUrl('/items/weapons/ratio'))
  ]);
  const [item, ratios] = await Promise.all([
    itemData.json(),
    ratiosData.json()
  ]);
  return { item, slug, ratios };
}

export default WeaponPage;

