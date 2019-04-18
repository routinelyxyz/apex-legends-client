import css from './style.scss';

export const Checkmark = ({ title, content = title, ...inputProps }) => (
  <label
    className={css.check__container}
    data-testid={'Checkmark__container'}
  >
    <input
      type="checkbox"
      {...inputProps}
      className={css.check__input}
      data-testid={'Checkmark__input'}
    />
    <span className={css.check__mark}/>
    <span className={css.check__title}>
      {content}
    </span>
  </label>
);

export default Checkmark;
