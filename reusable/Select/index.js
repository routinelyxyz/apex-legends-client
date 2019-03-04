import css from './style.scss';
import { applyCss } from '../../helpers';

export const Select = ({ children, active, className = '', disabled, ...selectProps }) => (
  <select
    {...applyCss(
      css.container,
      disabled && css.disabled,
      active && css.active,
      className
    )}
    disabled={disabled}
    {...selectProps}
  >
    {children}
  </select>
);

export default Select;