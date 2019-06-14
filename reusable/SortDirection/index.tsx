import React from 'react';
import css from './style.scss';

export const SortDirection = (props: React.HTMLProps<HTMLInputElement>) => (
  <label className={css.container}>
    <input
      type="checkbox"
      className={css.checkbox}
      {...props}
    />
    <img
      src="/static/arrows.svg"
      className={css.arrows}
    />
  </label>
);