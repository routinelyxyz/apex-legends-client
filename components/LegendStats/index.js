import css from './style.scss';
import { getStatic, statsProps } from '../../helpers';

import { LegendStatsValue } from '../LegendStatsValue';

export const LegendStats = ({ stats }) => {
  const availaibleProps = statsProps.legend.filter(prop => stats[prop].value != null);
  
  if (!availaibleProps.length) {
    return null;
  }

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
        {availaibleProps.map(prop => (
          stats[prop].value != null && (
            <LegendStatsValue
              key={prop}
              prop={prop}
              value={stats[prop].value}
              percentile={stats[prop].percentile}
              rank={stats[prop].rank}
            />
          )
        ))}
      </ul>
    </div>
  )
}