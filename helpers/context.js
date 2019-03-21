import React, { useState, useMemo, useEffect } from 'react';
import { useDevice } from '../hooks';

export const ModalContext = React.createContext();

export const ModalProvider = ({ children }) => {
  const [opened, setOpened] = useState(false);
  const { isDesktop } = useDevice();

  const value = useMemo(() => ({
    opened,
    scroll: !opened || !isDesktop,
    setOpened: (status = !opened, options = {}) => {
      setOpened(status);
    }
  }), [opened, isDesktop]);

  useEffect(() => {
    document.body.classList.toggle('hidden_scroll', value.scroll);
  }, [opened]);

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

export const MobileMenuContext = React.createContext();

export const MobileMenuProvider = ({ children }) => {
  const [visible, setVisible] = useState(true);

  const value = useMemo(() => ({
    visible,
    setVisible: (status = !visible) => setVisible(status)
  }), [visible]);

  return (
    <MobileMenuContext.Provider value={value}>
      {children}
    </MobileMenuContext.Provider>
  );
}