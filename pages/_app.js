import React from 'react'
import App, { Container } from 'next/app'
import LoadFonts from '../middleware/font';

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
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
