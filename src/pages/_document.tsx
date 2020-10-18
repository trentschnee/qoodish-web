import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core';
import { Fragment } from 'react';

const styles = {
  body: {
    padding: 0,
    margin: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    backgroundColor: '#f1f1f1'
  }
};

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const muiSheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => muiSheets.collect(<App {...props} />),
        enhanceComponent: Component => Component
      });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <Fragment>
          {initialProps.styles}
          {muiSheets.getStyleElement()}
        </Fragment>
      )
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href={process.env.NEXT_PUBLIC_ICON_512}
          />
          <link
            rel="icon"
            type="image/x-icon"
            href={process.env.NEXT_PUBLIC_ICON_512}
          />
          <link
            rel="apple-touch-icon"
            type="image/png"
            href={process.env.NEXT_PUBLIC_ICON_512}
          />
          <link
            href="https://fonts.googleapis.com/css?family=Lobster"
            rel="preconnect dns-prefetch stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            rel="preconnect dns-prefetch stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="preconnect dns-prefetch stylesheet"
          />

          <link
            href="https://www.googleapis.com"
            rel="preconnect dns-prefetch"
          />
          <link
            href="https://www.google-analytics.com"
            rel="preconnect dns-prefetch"
          />
          <link
            href="https://storage.cloud.google.com"
            rel="preconnect dns-prefetch"
          />
          <link
            href="https://storage.googleapis.com"
            rel="preconnect dns-prefetch"
          />
          <link
            href="https://firestore.googleapis.com"
            rel="preconnect dns-prefetch"
          />

          <meta
            property="fb:app_id"
            content={process.env.NEXT_PUBLIC_FB_APP_ID}
          />

          <meta name="theme-color" content="#ffc107" />
          <meta property="og:type" content="website" />
          <meta name="twitter:domain" content="qoodish.com" />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() {
                  dataLayer.push(arguments);
                }
                gtag('js', new Date());
              `
            }}
          />
        </Head>
        <body style={styles.body}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
