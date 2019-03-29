import css from './style.scss';
import { getStatic, statsProps, statsPropTitles } from '../../helpers';

export const LegendStats = ({ stats }) => {
  const { id, legend } = stats;
  return (
    <div className={`box ${css.container}`}>
      <div className={css.legend_container}>
        <p className={css.legend_name}>
          {stats.legend.name}
        </p>
        <img
          src={getStatic(stats.legend.img)}
          className={css.legend_img}
        />
      </div>
      <ul className={css.stats_list}>
        {statsProps.lifetime.map(prop => (
          stats[prop] != null && (
            <li
              className={css.stats_item}
              key={prop}
            >
              <p className={css.prop}>
                {statsPropTitles[prop] || prop}
              </p>
              <span className={css.val}>
                {stats[prop].toLocaleString().replace(/,/g, '.').replace(' ', ',')}
              </span>
            </li> 
          )
        ))}
      </ul>
    </div>
  )
}