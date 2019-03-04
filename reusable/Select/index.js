import css from './style.scss';

export const Select = ({ children, className = '', ...selectProps }) => (
  <select
    className={[css.container, className].join(' ')}
    {...selectProps}
  >
    {children}
  </select>
);

export default Select;