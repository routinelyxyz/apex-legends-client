import css from './style.scss';
import Link from 'next/link';
import { STATIC } from '../../helpers';

const Item = ({ item, ...flipProps }) => (
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
            alt={`${item.name} - Apex Legends`}
          />
          <img
            alt={`${item.ammo.name} ammo - Apex Legends`}
            className={`${css.ammo_img} ${item.ammo.name === 'Unique' && css.unique}`}
            src={STATIC + item.ammo.img}
          />
        </div>
      </a>
    </Link>
  </div>
);

export default Item;