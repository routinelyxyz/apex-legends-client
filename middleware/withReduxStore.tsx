import React from 'react';
import { initializeStore, AppState } from '../store';
import { NextAppContext } from 'next/app';
import { NextComponentClass } from 'next';
import { isServer } from '../helpers/consts';

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState?: AppState) {
  if (isServer) {
    return initializeStore(initialState);
  }

  if (!(window as any)[__NEXT_REDUX_STORE__]) {
    (window as any)[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return (window as any)[__NEXT_REDUX_STORE__];
}


export const withReduxStore = (App: NextComponentClass) =>
  class AppWithRedux extends React.Component {

    store: AppState;

    static async getInitialProps (appContext: NextAppContext<{}, { store: AppState }>) {
      const store = getOrCreateStore();
      let appProps = {};

      appContext.ctx.store = store;

      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: store.getState()
      }
    }

    constructor(props: any) {
      super(props);
      this.store = getOrCreateStore();
    }

    render() {
      return (
        <App
          {...this.props}
          store={this.store}
        />
      )
    } 
  }