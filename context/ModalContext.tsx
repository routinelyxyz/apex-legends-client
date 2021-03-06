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