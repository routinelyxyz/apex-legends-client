import css from './style.scss';

const Checkmark = ({ title, content = title, ...inputProps }) => (
  <label className={css.check__container}>
    <input
      type="checkbox"
      {...inputProps}
      className={css.check__input}
    />
    <span className={css.check__mark}/>
    <span className={css.check__title}>
      {content}
    </span>
  </label>
);

export default Checkmark;
