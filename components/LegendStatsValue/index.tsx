import React from 'react';
import css from './style.scss';
import { statsTitlesMap } from '../../helpers';
import { LegendStatsData } from '../../pages/stats/reducer';

import { ProgressBar } from '../../reusable/ProgressBar';

interface LegendStatsValueProps extends LegendStatsData {
  link<T, P>(rank: T, prop: P): string
}

const LegendStatsValue = ({
  value,
  prop,
  rank,
  percentile,
  link = rank => '#' + rank
}: LegendStatsValueProps) => {
  const percents = percentile <= 1 ? percentile * 100 : percentile;
  return (
    <li
      className={css.container}
      key={prop}
    >
      <span className={css.prop}>
        {statsTitlesMap[prop] || prop}
      </span>
      <p className={css.value}>
        {value.toLocaleString('en-US')}
      </p>
      <ProgressBar
        value={percents}
        width={130}
        height={3}
      />
      <p className={css.rank}>
        {link(rank, prop)}
      </p>
    </li>
  );
}

const Memoized = React.memo(LegendStatsValue);
export { Memoized as LegendStatsValue };