import css from './style.scss';
import { applyCss } from '../../util';

import { PlayerLink } from '../../components/PlayerLink';

const avatar = "http://opgg-static.akamaized.net/images/profile_icons/profileIcon3182.jpg";

export const PlayerCard = ({ data, scaleSize, className, place = 1 }) => {
  const props = [
    { name: 'Kills', prop: 'kills' },
    { name: 'Damage', prop: 'damage' },
    { name: 'Headshots', prop: 'headshots' },
  ]
  return (
    <div {...applyCss(
      css.container,
      css[`top${place}`],
      className,
      scaleSize && css.scale
    )}>
      <div className={css.avatar_container}>
        <img
          className={css.avatar}
          src={avatar}
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