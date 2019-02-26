import React from 'react';
import { initializeStore } from '../store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  if (isServer) {
    return initializeStore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}


export const withReduxStore = App =>
  class AppWithRedux extends React.Component {
    static async getInitialProps (appContext) {

      const store = getOrCreateStore();
      appContext.ctx.store = store;

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps(appContext);
      }

      return {
        ...appProps,
        initialReduxState: store.getState()
      }
    }

    constructor(props) {
      super(props);
      this.store = getOrCreateStore();
    }

    render() {
      return <App {...this.props} store={this.store}/>
    } 
  }