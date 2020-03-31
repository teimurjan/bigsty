import { extractCritical } from 'emotion-server';
import Document, { Head, Main, NextScript } from 'next/document';
import * as React from 'react';

class CustomNextDocument extends Document {
  static getInitialProps({ renderPage }: any) {
    const page = renderPage();
    const styles = extractCritical(page.html);
    return { ...page, ...styles };
  }

  render() {
    const { ids, css } = this.props as any;

    return (
      <html>
        <Head>
          <style data-emotion-css={ids.join(' ')} dangerouslySetInnerHTML={{ __html: css }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default CustomNextDocument;
