import React, { useContext } from 'react';
import css from './style.scss';
import { useDevice } from '../../hooks';
import { ModalContext } from '../../context';

import { ModalSlide } from '../../reusable/Modal';

interface MobileModalProps {
  title: string
  modalTitle?: string
  /**
   * @type ReactNode
   * @ignore React.FC inproperly uses ReactNode type
   */
  children?: any
}
export const MobileModal = ({
  title,
  modalTitle,
  children
}: MobileModalProps) => {
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
    );
  }

  return children;
}