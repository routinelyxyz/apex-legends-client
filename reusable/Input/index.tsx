import React from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface BasicInputProps extends React.HTMLProps<HTMLInputElement> {
  className?: string
  type?: 'text' | 'password' | 'date' | 'search' | 'url'
}
export const BasicInput = ({
  className,
  type = 'text',
  ...props
}: BasicInputProps) => (
  <input
    type={type}
    {...applyCss(
      css.input,
      className
    )}
    {...props}
  />
);

export default BasicInput;
