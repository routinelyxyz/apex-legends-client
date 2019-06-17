import React, { ReactNode, HTMLProps } from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface BasicButtonProps extends HTMLProps<HTMLButtonElement> {
  title?: string
  active?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  children?: ReactNode
}
export const BasicButton = ({
  title,
  children = title,
  active = true,
  className,
  ...btnProps
}: BasicButtonProps) => (
  <button
    {...btnProps}
    {...applyCss(
      css.container,
      active && css.active,
      className
    )}
  >
    {children}
  </button>
);