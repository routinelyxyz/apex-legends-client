import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import LoadFonts from '../middleware/font';
import '../assets/css/global.scss';
import { withReduxStore } from '../middleware/with-redux-store';
import { Provider } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import "../assets/css/global.scss";
import dayjs from 'dayjs';
dayjs.extend(relativeTime);
import { loadSavedPlayersAsync } from '../store/actions-async/stats';
import axios from 'axios';
import { HOST_URL } from '../helpers';
import { GA_ID } from '../helpers/consts';
import Router from 'next/router';
import NProgress from 'nprogress';
import { MobileMenuProvider } from '../helpers/context';

axios.defaults.baseURL = HOST_URL;
axios.defaults.timeout = 9000;

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
    if ('serviceWorker' in navigator) {
      // navigator.serviceWorker
      //   .register('/sw.js')
      //   .then(registration => {
      //     console.log('service worker registration successful')
      //     console.log(registration)
      //   })
      //   .catch(err => {
      //     console.warn('service worker registration failed', err.message)
      //   });
    }
    Router.events.on('routeChangeStart', url => {
      NProgress.start();
    });
    Router.events.on('routeChangeComplete', url => {
      NProgress.done();
      if (window.gtag) {
        window.gtag('config', GA_ID, {
          page_location: window.location.href,
          page_path: window.location.pathname,
          page_title: window.document.title,
        });
      }
    });
    Router.events.on('routeChangeError', () => NProgress.done());
    this.props.store.dispatch(
      loadSavedPlayersAsync()
    );
  }

  render () {
    const { Component, pageProps, router, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <MobileMenuProvider>
            <Layout route={router.route}>
              <Component {...pageProps}/>
            </Layout>
          </MobileMenuProvider>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
