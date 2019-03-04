import css from './style.scss';
import { applyCss } from '../../helpers';

export const Select = ({ children, className = '', disabled, ...selectProps }) => (
  <select
    {...applyCss(
      css.container,
      disabled && css.disabled,
      className
    )}
    disabled={disabled}
    {...selectProps}
  >
    {children}
  </select>
);

export default Select;