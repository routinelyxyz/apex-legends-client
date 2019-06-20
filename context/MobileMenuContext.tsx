import React, { useState, useMemo, ReactNode } from 'react';

interface MobileMenuContext {
  visible: boolean
  setVisible(status: boolean): void
}
export const MobileMenuContext = React.createContext<MobileMenuContext>({
  visible: true,
  setVisible() {}
});


interface MobileMenuProviderProps {
  children: ReactNode
}
export const MobileMenuProvider = ({ children }: MobileMenuProviderProps) => {
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