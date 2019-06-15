import css from './style.scss';
import React, { ReactNode } from 'react';

interface ModalSlideProps {
  opened: boolean
  onClose: () => {}
  title?: string
  children: ReactNode
}
export const ModalSlide = ({
  opened,
  onClose,
  title,
  children
}: ModalSlideProps) => {

  if (!opened) {
    return null;
  }

  const handleOnClose = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className={css.container}
      onClick={handleOnClose}
    >
      {title && <h3>{title}</h3>}
      <div className={css.slider}>
        {children}
      </div>
    </div>
  )
}