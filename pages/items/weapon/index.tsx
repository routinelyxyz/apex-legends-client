import React, { useMemo } from 'react';
import css from './style.scss';
import { ammoNames, weaponPropTitles, getStatic, weaponPropsArr } from '../../../helpers';
import Link from 'next/link';
import Head from 'next/head';
import Axios from 'axios';
import { round } from '../../../util';
import { Weapon, WeaponRatios } from '../../../types';

import { HorizontalNavTab } from '../../../reusable/HorizontalNav';
import { ProgressBar } from '../../../reusable/ProgressBar';


const halfLength = Math.ceil(weaponPropsArr.length / 2);
const splittedProps = [
  weaponPropsArr.slice(0, halfLength),
  weaponPropsArr.slice(halfLength, weaponPropsArr.length)
];

interface WeaponPageProps {
  item: Weapon
  ratios: WeaponRatios
}
const WeaponPage = ({ item, ratios }: WeaponPageProps) => {

  const calcedRatio = useMemo(() => ratios
    .filter(ratio => ratio.name !== 'headshotDPS')
    .map(({ name, min, diff }) => {
      const isReloadProp = name === 'reloadTime' || name === 'emptyReload';
      const valueMinusMin = Number(item[name]) - min;

      let value = round(isReloadProp
        ? diff / valueMinusMin
        : valueMinusMin / diff
      , 100);

      if (value < 1) {
        value = 1;
      }
      return { name, value }
    })
  , []);

  const ammoName: string = (ammoNames as any)[item.ammo.name] || item.ammo.name;
  
  return (
    <div>
      <Head>
        <title>{item.name} - Weapons explorer | Apex-Legends.win</title>
      </Head>
      <div className={css.header}>
        <div>
          <div className={css.header_details}>
            <div className={css.heading_container}>
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
            </div>
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
          </div>
          <ul className={css.stats_bars}>
            {calcedRatio.map(({ name, value }) => (
              <li key={name} className={css.stats_bar}>
                <ProgressBar
                  title={weaponPropTitles[name]}
                  className={css.progress_bar}
                  hoverTitle={p => 
                    `${weaponPropTitles[name]} - ${item[name]} (${p}%)`
                  }
                  value={value}
                  delay={150}
                />
              </li>
            ))}
          </ul>
        </div>
        <figure className={css.img_container}>
          <img
            src={getStatic(item.img)}
            className={css.item_img}
          />
        </figure>
      </div>
      <HorizontalNavTab
        tabs={[
          {
            title: 'Overview',
            content: (
              <article className={css.overview_container}>
                {splittedProps.map((propsCol, index) => (
                  <ul className={css.props_list} key={index}>
                    {propsCol.map(({ prop, title, parser }) => (
                      <li
                        key={prop}
                        className={css.prop_row}
                      >
                        <span className={css.prop_name}>
                          {title}
                        </span>
                        <span className={css.prop_value}>
                          {parser ? parser((item as any)[prop]) : (item as any)[prop]}
                        </span>
                      </li>
                    ))}
                  </ul>
                ))}
              </article>
            )
          }
        ]}
      />
    </div>
  )
}

interface GetInitialPropsParams {
  query: {
    slug?: string
  }
}
WeaponPage.getInitialProps = async ({ query: { slug } = {}}: GetInitialPropsParams) => {
  const [itemResponse, ratioResponse] = await Promise.all([
    Axios.get(`/items/weapon/${slug}`),
    Axios.get('/items/weapons/ratio'),
  ]);

  const item = itemResponse.data.data;
  const ratios = ratioResponse.data.data;

  return { slug, item, ratios };
}

export default WeaponPage;

