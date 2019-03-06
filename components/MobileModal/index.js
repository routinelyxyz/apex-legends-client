import css from './style.scss';
import React, { useState } from 'react';
import { useDevice } from '../../hooks';

import { ModalSlide } from '../../reusable/Modal';

export const MobileModal = ({ children, title, modalTitle }) => {
  const { isPhone } = useDevice();
  const [opened, setOpened] = useState(false);

  if (isPhone) {
    return (
      <>
        <button
          className={css.btn}
          onClick={() => setOpened(!opened)}
        >
          {title}
        </button>
        <ModalSlide
          opened={opened}
          title={modalTitle}
          onClose={() => setOpened(false)}
        >
          {children}
        </ModalSlide>
      </>
    )
  }

  return children;
}