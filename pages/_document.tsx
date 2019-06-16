import React from 'react';
import Document, { Head, Main, NextScript, NextDocumentContext } from 'next/document';
import { GA_ID, NODE_ENV } from '../helpers/consts';

const description = 'Apex Legends stats, leaderboards, interactive and detailed items explorer, legend details. Quick updates with live and daily match tracking.';


interface MyDocumentProps {
  isProduction: boolean
}
class MyDocument extends Document<MyDocumentProps> {

  static async getInitialProps(ctx: NextDocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const isProduction = NODE_ENV === 'production';

    return { ...initialProps, isProduction };
  }

  setGoogleTags = () => ({
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', '${GA_ID}');
    `
  });

  render() {
    const { isProduction } = this.props;
    return (
      <html lang="en">
        <Head>
          <meta charSet="UTF-8" key="charSet"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport"/>
          <meta name="description" content={description} key="description"/>
          <meta name="ogDescription" content={description} key="ogDescription"/>
          <meta name="theme-color" content="#23232F" key="theme-color"/>
          <link rel="manifest" href="/static/manifest.webmanifest"/>
          <link rel='stylesheet' type='text/css' href='/static/assets/nprogress.css' />
        </Head>
        <body>
          <Main/>
          <NextScript/>
          {isProduction && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}/>
              <script dangerouslySetInnerHTML={this.setGoogleTags()}/>
            </>
          )}
        </body>
      </html>
    );
  }
}

export default MyDocument;