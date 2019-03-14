import React, { useState, useMemo } from 'react';

export const ScrollContext = React.createContext(true);


class ScrollCtx extends React.Component {

  constructor() {
    super();
    this.state = {
      value: {
        opened: true
        
      }
    }
  }

  render() {
    return (
      <ScrollContext.Provider>
        {this.props.children}
      </ScrollContext.Provider>
    )
  }
}

export const ModalContext = React.createContext();


export const ModalProvider = ({ children }) => {
  const [opened, setOpened] = useState(false);

  const value = useMemo(() => ({
    opened,
    scroll: !opened,
    setOpened: (status = !opened) => setOpened(status)
  }), [opened]);

  const val2 = {
    opened,
    scroll: !opened,
    setOpened: (status = !opened) => setOpened(status)
  }

  return (
    <ModalContext.Provider value={{
      opened,
      scroll: !opened,
      ok: false
    }}>
      {children}
    </ModalContext.Provider>
  )
}