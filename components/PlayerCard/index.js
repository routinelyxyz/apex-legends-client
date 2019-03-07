import css from './style.scss';

const avatar = "http://opgg-static.akamaized.net/images/profile_icons/profileIcon3182.jpg";

export const PlayerCard = ({ player }) => {
  const data = [
    { name: 'Kills', value: 41 },
    { name: 'Damage', value: 561 },
    { name: 'Headshots', value: 12 },
  ]
  return (
    <div className={css.container}>
      <div className={css.avatar_container}>
        <img
          className={css.avatar}
          src={avatar}
        />
      </div>
      <div className={css.card}>
        <p className={css.name}>
          RockAlone
        </p>
        <ul className={css.data_list}>
          {data.map(({ name, value }) => (
            <li
              className={css.data_item}
              key={name}
            >
              <span className={css.prop}>{name}</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}