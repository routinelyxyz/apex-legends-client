import css from './style.scss';
import { statsTitlesMap } from '../../helpers';
import React from 'react';

import { ProgressBar } from '../../reusable/ProgressBar';

const LegendStatsValue = ({ value, prop, rank, percentile }) => {
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
        #{rank}
      </p>
    </li>
  );
}

const Memoized = React.memo(LegendStatsValue);
export { Memoized as LegendStatsValue };