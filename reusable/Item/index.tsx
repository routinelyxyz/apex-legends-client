import React from 'react';
import css from './style.scss';
import Link from 'next/link';
import { STATIC } from '../../helpers/consts';
import { applyCss } from '../../helpers';
import { Weapon } from '../../types';

interface WeaponItemProps {
  item: Weapon
  [key: string]: any
}

export const WeaponItem = ({
  item,
  ...flipProps
}: WeaponItemProps) => (
  <div
    className={`${css.container} ${css.item_rare}`}
    {...flipProps}
  >
    <Link
      href={`/items/weapon?slug=${item.slug}`}
      as={`/items/weapon/${item.slug}`}
      passHref
    >
      <a>
        <p className={css.item__name}>
          {item.name}
        </p>
        <div className={css.item__container}>
          <img
            className={css.item__img}
            src={STATIC + item.img}
            alt={`${item.name} weapon image - Apex Legends`}
          />
          <img
            alt={`${item.ammo.name} weapon ammo - Apex Legends`}
            src={STATIC + item.ammo.img}
            {...applyCss(
              css.ammo_img,
              item.ammo.name === 'Unique' && css.unique
            )}
          />
        </div>
      </a>
    </Link>
  </div>
);

export { WeaponItem as Item };
export default WeaponItem;