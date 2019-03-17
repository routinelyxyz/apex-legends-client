import css from './style.scss';
import React, { useState, useContext } from 'react';
import { useDevice } from '../../hooks';
import { ModalContext } from '../../helpers/context';

import { ModalSlide } from '../../reusable/Modal';

export const MobileModal = ({ children, title, modalTitle }) => {
  const { isPhone } = useDevice();
  const modal = useContext(ModalContext);

  if (isPhone) {
    return (
      <>
        <button
          className={css.btn}
          onClick={() => modal.setOpened(true)}
        >
          {title}
        </button>
        <ModalSlide
          opened={modal.opened}
          title={modalTitle}
          onClose={() => modal.setOpened(false)}
        >
          {children}
        </ModalSlide>
      </>
    )
  }

  return children;
}