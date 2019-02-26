import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import LoadFonts from '../middleware/font';
import '../assets/css/global.scss';
import { withReduxStore } from '../middleware/with-redux-store';
import { Provider } from 'react-redux';

import Layout from '../layouts';

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps }
  }

  componentDidMount() {
    LoadFonts();
  }

  render () {
    const { Component, pageProps, router, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Layout route={router.route}>
            <Component {...pageProps}/>
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
