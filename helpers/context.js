import React, { useState, useMemo, useEffect } from 'react';

export const ModalContext = React.createContext();

export const ModalProvider = ({ children }) => {
  const [opened, setOpened] = useState(false);

  const value = useMemo(() => ({
    opened,
    scroll: !opened,
    setOpened: (status = !opened) => setOpened(status)
  }), [opened]);

  useEffect(() => {
    document.body.classList.toggle('hidden_scroll', opened);
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