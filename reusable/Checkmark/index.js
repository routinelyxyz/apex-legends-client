import css from './style.scss';

export const Checkmark = ({ title, content = title, ...inputProps }) => (
  <label className={css.check__container}>
    <input
      type="checkbox"
      className={css.check__input}
      {...inputProps}
    />
    <span className={css.check__mark}/>
    <span className={css.check__title}>
      {content}
    </span>
  </label>
);

export default Checkmark;
