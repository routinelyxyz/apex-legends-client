import css from './style.scss';
import { getStatic, statsProps, statsPropTitles } from '../../helpers';

import { LegendStatsValue } from '../LegendStatsValue';

export const LegendStats = ({ stats }) => {
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
        {statsProps.legend.map(prop => (
          stats[prop].value != null && (
            <LegendStatsValue
              key={prop}
              prop={prop}
              value={stats[prop].value}
              percentile={stats[prop].percentile * 100}
            />
          )
        ))}
      </ul>
    </div>
  )
}