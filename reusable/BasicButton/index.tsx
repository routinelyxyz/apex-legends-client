import React, { ReactNode } from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface BasicButtonProps {
  title?: string
  active?: boolean
  className?: string
  children?: ReactNode
}
export const BasicButton = ({
  title,
  children = title,
  active = true,
  className,
  ...btnProps
}: BasicButtonProps) => {
  return (
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
  )
}