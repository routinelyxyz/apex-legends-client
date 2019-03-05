import css from './style.scss';

export const SortDirection = inputProps => (
  <label className={css.container}>
    <input
      type="checkbox"
      className={css.checkbox}
      {...inputProps}
    />
    <img
      src="/static/arrows.svg"
      className={css.arrows}
    />
  </label>
);