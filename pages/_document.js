import Document, { Head, Main, NextScript } from 'next/document';

const description = 'Apex Legends stats, leaderboards, interactive and detailed items explorer, legend details. Quick updates with live and daily match tracking.';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <html>
        <Head>
          <meta charset="UTF-8" key="charset"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" key="viewport"/>
          <meta name="description" content={description} key="description"/>
          <meta name="ogDescription" content={description} key="ogDescription"/>
          <meta name="theme-color" content="#23232F" key="theme-color"/>
          <title>Apex Legends Stats & Items Explorer & Leaderboards & Legends</title>
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