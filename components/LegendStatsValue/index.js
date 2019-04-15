import css from './style.scss';
import { statsTitlesMap } from '../../helpers';

import { ProgressBar } from '../../reusable/ProgressBar';

export const LegendStatsValue = ({ value, prop, percentile }) => (
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
      value={percentile}
      width={100}
      height={3}
    />
  </li>
)