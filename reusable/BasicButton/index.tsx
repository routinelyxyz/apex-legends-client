import React, { ReactChildren } from 'react';
import css from './style.scss';
import { applyCss } from '../../util';

interface BasicButtonProps {
  title?: string
  active?: boolean
  className?: string
  children?: ReactChildren | string
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