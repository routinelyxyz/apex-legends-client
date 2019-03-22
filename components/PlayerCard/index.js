import css from './style.scss';
import { applyCss } from '../../util';
import { getAvatar } from '../../helpers';

import { PlayerLink } from '../../components/PlayerLink';

export const PlayerCard = ({ data, scaleSize, className, horizontal, place = 1 }) => {
  const props = [
    { name: 'Kills', prop: 'kills' },
    { name: 'Damage', prop: 'damage' },
    { name: 'Headshots', prop: 'headshots' },
  ]
  return (
    <div {...applyCss(
      css.container,
      css[`top${place}`],
      scaleSize && css.scale,
      horizontal && css.horizontal,
      className
    )}>
      <div className={css.avatar_container}>
        <img
          className={css.avatar}
          src={getAvatar(data.player)}
        />
      </div>
      <div className={css.card}>
        <p className={css.name}>
          <PlayerLink player={data.player}>
            <a className={css.link}>
              {data.player.name}
            </a>
          </PlayerLink>
        </p>
        <ul className={css.data_list}>
          {props.map(({ name, prop }) => (
            <li
              className={css.data_item}
              key={name}
            >
              <span className={css.prop}>{name}</span>
              <span>{data[prop]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}