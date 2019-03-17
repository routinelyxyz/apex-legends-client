import Document, { Head, Main, NextScript } from 'next/document';
// import Manifest from 'next-manifest/manifest';

const title = 'Apex Legends Stats & Items Explorer & Leaderboards & Legends';
const description = 'Apex Legends stats, leaderboards, interactive and detailed items explorer, legend details. Quick updates with live and daily match tracking.';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
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
        </body>
      </html>
    );
  }
}

export default MyDocument;