import css from './style.scss';
import dayjs from 'dayjs';
import { getStatic } from '../../helpers';

export const StatsHistoryRecord = ({ match }) => {
  return (
    <li className={css.record__container}>
      <div className={css.record__box}>
        <img 
          src={getStatic(match.legend.img)}
          className={css.record__legend_image}
        />
        <span className={css.record__legend_name}>
          {match.legend.name}
        </span>
      </div>
      <div className={css.record__box}>
        <span className={css.record__prop}>
          Kills:
        </span>
        {match.kills}
      </div>
      <div className={css.record__box}>
        <span className={css.record__prop}>
          Time:
        </span>
        {dayjs(match.date).fromNow()}
      </div>
    </li>
  )
}