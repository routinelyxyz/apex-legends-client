import Document, { Head, Main, NextScript } from 'next/document';
// import Manifest from 'next-manifest/manifest';
import { GA_ID } from '../helpers/consts';

const title = 'Apex Legends Stats & Items Explorer & Leaderboards & Legends';
const description = 'Apex Legends stats, leaderboards, interactive and detailed items explorer, legend details. Quick updates with live and daily match tracking.';

class MyDocument extends Document {
  static async getInitialProps(ctx) {

    const initialProps = await Document.getInitialProps(ctx);
    const isProduction = process.env.NODE_ENV === 'production';

    return { ...initialProps, isProduction };
  }

  setGoogleTags = () => ({
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', '${GA_ID}');
    `
  })

  render() {
    const { isProduction } = this.props;
    return (
      <html lang="en">
        <Head>
          {/* <Manifest/> */}
          <meta charset="UTF-8" key="charset"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport"/>
          <meta name="description" content={description} key="description"/>
          <meta name="ogDescription" content={description} key="ogDescription"/>
          <meta name="theme-color" content="#23232F" key="theme-color"/>
          <link rel="manifest" href="/static/manifest.webmanifest"/>
          <link rel='stylesheet' type='text/css' href='/static/assets/nprogress.css' />
        </Head>
        <body className="">
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