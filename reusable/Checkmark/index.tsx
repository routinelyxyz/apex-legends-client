import React from 'react';
import css from './style.scss';

interface CheckmarkProps extends React.HTMLProps<HTMLInputElement> {
  title?: string
  body?: JSX.Element | string
}

export const Checkmark = ({
  title,
  body = title,
  ...inputProps
}: CheckmarkProps) => (
  <label className={css.check__container}>
    <input
      type="checkbox"
      className={css.check__input}
      {...inputProps}
    />
    <span className={css.check__mark}/>
    <span className={css.check__title}>
      {body}
    </span>
  </label>
);

export default Checkmark;
