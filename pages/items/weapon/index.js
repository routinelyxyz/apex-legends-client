import 'isomorphic-unfetch';
import css from './style.scss';
import { useMemo } from 'react';
import { weaponProps, getUrl, ammoNames, weaponPropTitles, getStatic } from '../../../helpers';
import Link from 'next/link';
import Head from 'next/head';

import { HorizontalNav } from '../../../reusable/HorizontalNav';
import { ProgressBar } from '../../../reusable/ProgressBar';

const halfLength = Math.ceil(weaponProps.length / 2);
const splittedProps = [
  weaponProps.slice(0, halfLength),
  weaponProps.slice(halfLength, weaponProps.length)
];


const WeaponPage = ({ slug, item, ratios }) => {

  const calcedRatio = useMemo(() => ratios
    .map(({ name, min, diff }) => {
      const valOutMin = item[name] - min;
      let value = Math.round(
        name === 'reload' || name === 'emptyReload'
          ? diff / valOutMin
          : valOutMin / diff
      * 100);
      if (value < 1) value = 1;
      return { name, value }
    })
  , []);

  const ammoName = ammoNames[item.ammo.name] || item.ammo.name;
  
  return (
    <div>
      <Head>
        <title>{item.name} - Weapons explorer | Apex-Legends.win</title>
      </Head>
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
                  className={css.ammo_img}
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
                className={css.progress_bar}
                hoverTitle={p => 
                  `${weaponPropTitles[name]} - ${item[name]} (${p}%)`
                }
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
          <a>Overview</a>
        </Link>
      </HorizontalNav>
      <article className={css.overview_container}>
        {splittedProps.map((propsCol, index) => (
          <ul className={css.props_list} key={index}>
            {propsCol.map(([prop, name, parser]) => (
              <li
                key={prop}
                className={css.prop_row}
              >
                <span className={css.prop_name}>
                  {name}
                </span>
                <span className={css.prop_value}>
                  {parser ? parser(item[prop]) : item[prop]}
                </span>
              </li>
            ))}
          </ul>
        ))}
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

