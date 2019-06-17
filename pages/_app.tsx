import 'core-js/features/object/from-entries';
import React from 'react';
import App, { Container, NextAppContext } from 'next/app';
import LoadFonts from '../middleware/font';
import '../assets/css/global.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Axios from 'axios';
import { GA_ID, HOST_URL } from '../helpers/consts';
import Router from 'next/router';
import NProgress from 'nprogress';
import { MobileMenuProvider, ModalProvider } from '../context';
import { MainLayout } from '../layouts/index';

dayjs.extend(relativeTime);
Axios.defaults.baseURL = HOST_URL;
Axios.defaults.timeout = 9000;

class MyApp extends App {

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
  }

  render() {
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <MobileMenuProvider>
          <ModalProvider>
            <MainLayout route={router.route}>
              <Component {...pageProps}/>
            </MainLayout>
          </ModalProvider>
        </MobileMenuProvider>
      </Container>
    );
  }
}

export default MyApp;