import css from './style.scss';
import dayjs from 'dayjs';
import { getStatic, applyCss } from '../../helpers';

const StatsProperty = ({ name, value, time }) => (
  <div className={css.record__box}>
    <p className={css.record__prop}>
      {name}
    </p>
    <span {...applyCss(
      css.record__value,
      time && css.record__time_value
    )}>
      {!time ? (value || 0).toLocaleString('en-US') : value}
    </span>
  </div>
)

export const StatsHistoryRecord = ({ match }) => {
  return (
    <li className={css.record__container}>
      <div className={css.record__box}>
        <span className={css.record__legend_name}>
          {match.legend.name}
        </span>
        <img 
          src={getStatic(match.legend.img)}
          className={css.record__legend_image}
        />
      </div>
      <StatsProperty 
        name="Kills"
        value={match.kills}
      />
      <StatsProperty 
        name="Damage"
        value={match.damage}
      />
      <StatsProperty 
        name="Time"
        value={dayjs(match.date).fromNow()}
        time
      />
    </li>
  )
}