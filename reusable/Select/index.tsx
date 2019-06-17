import React from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface BaseSelectProps extends React.HTMLProps<HTMLSelectElement> {
  active?: boolean
  className?: string
}
export const BaseSelect = ({
  active,
  className,
  disabled,
  ...props
}: BaseSelectProps) => (
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

export { BaseSelect as Select };
export default BaseSelect;