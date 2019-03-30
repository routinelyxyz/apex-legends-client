import css from './style.scss';
import { statsPropTitles  } from '../../helpers';

import { ProgressBar } from '../../reusable/ProgressBar';

export const LegendStatsValue = ({ stats, prop }) => (
  <li
    className={css.container}
    key={prop}
  >
    <span className={css.prop}>
      {statsPropTitles[prop] || prop}
    </span>
    <p className={css.value}>
      {stats[prop].toLocaleString('en-US')}
    </p>
    {false && (
      <ProgressBar
        value={65}
        width={100}
        height={3}
      />
    )}
  </li>
)