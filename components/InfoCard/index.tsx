import React, { ReactNode } from 'react';
import css from './style.scss';

interface InfoCardProps {
  title: string
  content?: ReactNode
  children?: ReactNode
  className?: string
}
export const InfoCard = ({
  title,
  content,
  children = content,
  className
}: InfoCardProps) => (
  <div className={className}>
    <p className={css.title}>
      {title}
    </p>
    <div className={css.content}>
      {children}
    </div>
  </div>
);