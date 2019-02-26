import React, { useEffect } from 'react'
import App, { Container } from 'next/app'
import LoadFonts from '../middleware/font';
import '../assets/css/global.scss';

import Layout from '../layouts';

// Apply context / portal for sub-nested routing shared components

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
    const { Component, pageProps, router } = this.props;
    return (
      <Container>
        <Layout route={router.route}>
          <Component {...pageProps}/>
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
