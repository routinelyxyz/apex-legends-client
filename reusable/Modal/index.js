import css from './style.scss';
import React from 'react';

export const ModalSlide = ({ children, opened, onClose, title }) => {
  if (!opened) return null;
  return (
    <div
      className={css.container}
      onClick={e =>
        e.target === e.currentTarget && onClose() 
      }
    >
      {title && <h3>{title}</h3>}
      <div className={css.slider}>
        {children}
      </div>
    </div>
  )
}