import css from './style.scss';
import { applyCss } from '../../helpers';

export const Select = ({ active, className, disabled, ...props }) => (
  <select
    {...applyCss(
      css.container,
      disabled && css.disabled,
      active && css.active,
      className
    )}
    disabled={disabled}
    {...props}
  />
);

export default Select;