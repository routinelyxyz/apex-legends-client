import css from './style.scss';
import { animated } from 'react-spring';
import { STATIC } from '../../helpers';

const Item = ({ item, ...springProps }) => {
  return (
    <animated.div
      className={`${css.container} ${css.item_rare}`}
      {...springProps}
    > 
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
    </animated.div>
  )
}

export default Item;