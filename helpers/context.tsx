import React, { useState, useMemo, useEffect, ReactNode } from 'react';
import { useDevice } from '../hooks';

type ModalContext = {
  opened: boolean
  scroll: boolean
  setOpened(status: boolean): any
}
export const ModalContext = React.createContext<ModalContext>({} as any);


interface ModalProviderProps {
  children: ReactNode
}
export const ModalProvider = (_props: ModalProviderProps) => {
  const [opened, setOpened] = useState(false);
  const { isDesktop } = useDevice();

  const value = useMemo(() => ({
    opened,
    setOpened: (status = !opened) => {
      setOpened(status);
    },
    scroll: opened
      ? isDesktop ? false : true
      : false
  }), [opened, isDesktop]);

  useEffect(() => {
    document.body.classList.toggle('hidden_scroll', value.scroll);
  }, [opened]);

  return (
    <ModalContext.Provider value={value} />
  );
}

interface MobileMenuContext {
  visible: boolean
  setVisible(status: boolean): void
}
export const MobileMenuContext = React.createContext<MobileMenuContext>({} as any);


interface MobileMenuProviderProps {
  children: ReactNode
}
export const MobileMenuProvider = (_props: MobileMenuProviderProps) => {
  const [visible, setVisible] = useState(true);

  const value = useMemo(() => ({
    visible,
    setVisible: (status = !visible) => setVisible(status)
  }), [visible]);

  return (
    <MobileMenuContext.Provider value={value} />
  );
}