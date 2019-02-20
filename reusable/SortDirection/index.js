import styled from 'styled-components';
import css from './style.scss';

export const SortDirection = () => (
  <label className={css.container}>
    <input
      type="checkbox"
      className={css.checkbox}
    />
    <img
      src="/static/arrows.svg"
      className={css.arrows}
    />
  </label>
);