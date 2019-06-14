import React from 'react';
import css from './style.scss';
import { getStatic } from '../../helpers';
import { LegendStatsRecord } from '../../pages/stats/reducer';

import { LegendStatsValue } from '../LegendStatsValue';


interface LegendStatsProps {
  stats: LegendStatsRecord
}

export function LegendStats({ stats }: LegendStatsProps) {
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
        {stats.data.map((data) => (
          <LegendStatsValue {...data} />
        ))}
      </ul>
    </div>
  )
}