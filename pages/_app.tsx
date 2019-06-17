import 'core-js/features/object/from-entries';
import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import LoadFonts from '../middleware/font';
import '../assets/css/global.scss';
import { withReduxStore } from '../middleware/with-redux-store';
import { Provider } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { loadSavedPlayersAsync } from '../store/actions-async/stats';
import axios from 'axios';
import { GA_ID, HOST_URL } from '../helpers/consts';
import Router from 'next/router';
import NProgress from 'nprogress';
import { MobileMenuProvider, ModalProvider } from '../context';
import Layout from '../layouts';

dayjs.extend(relativeTime);
axios.defaults.baseURL = HOST_URL;
axios.defaults.timeout = 9000;

interface MyAppProps {
  store: any
}
class MyApp extends App<MyAppProps> {

  static async getInitialProps({
    Component,
    ctx
  }: NextAppContext) {

    if (Component.getInitialProps) {
      const pageProps = await Component.getInitialProps(ctx);
      return { pageProps }
    }

    return { pageProps: {} }
  }

  componentDidMount() {
    LoadFonts();
    Router.events.on('routeChangeStart', (url: string) => {
      if (!url.includes('/items?')) {
        NProgress.start();
      }
    });
    Router.events.on('routeChangeComplete', () => {
      NProgress.done();
      if (process.env.NODE_ENV === 'production' && (window as any).gtag) {
        (window as any).gtag('config', GA_ID, {
          page_location: window.location.href,
          page_path: window.location.pathname,
          page_title: window.document.title,
        });
      }
    });
    Router.events.on('routeChangeError', () => NProgress.done());
    setTimeout(() =>
      this.props.store.dispatch(
        loadSavedPlayersAsync()
      )
    );
  }

  render() {
    const { Component, pageProps, router, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <MobileMenuProvider>
            <ModalProvider>
              <Layout route={router.route}>
                <Component {...pageProps}/>
              </Layout>
            </ModalProvider>
          </MobileMenuProvider>
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);