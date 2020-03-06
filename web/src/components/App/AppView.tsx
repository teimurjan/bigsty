import * as React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Global, css } from '@emotion/core';
import { Helmet } from 'react-helmet';

import { Admin } from 'src/components/Admin/Admin';
import { PageLoader } from 'src/components/common/PageLoader/PageLoader';
import { PrivateRoute } from 'src/components/PrivateRoute';
import { Client } from 'src/components/Client/Client';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { useIntl } from 'react-intl';

interface IProps {
  isLoading: boolean;
}

export const AppView = ({ isLoading }: IProps) => {
  const { iconPathPrefix, manifestPath } = useMedia(
    [mediaQueries.darkMode],
    [{ iconPathPrefix: '/dark-icon', manifestPath: '/dark-manifest.json' }],
    { iconPathPrefix: '/icon', manifestPath: '/manifest.json' },
  );

  const intl = useIntl();

  return (
    <>
      <Helmet>
        <link rel="apple-touch-icon" sizes="180x180" href={`${iconPathPrefix}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${iconPathPrefix}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${iconPathPrefix}/favicon-16x16.png`} />
        <link rel="shortcut icon" href={`${iconPathPrefix}/favicon.ico`} />
        <link rel="manifest" href={manifestPath} />
        <title>{intl.formatMessage({ id: 'Meta.title' })}</title>
        <meta name="description" content={intl.formatMessage({ id: 'Meta.description' })} />
        <meta name="keywords" content={intl.formatMessage({ id: 'Meta.keywords' })} />
      </Helmet>
      <Global
        styles={css`
          @import url('https://fonts.googleapis.com/css?family=Oswald:300,400,500,700&display=swap');

          body,
          button,
          input,
          select,
          textarea {
            font-family: 'Oswald', sans-serif;
          }

          html {
            overflow: auto;
          }

          .button {
            border-radius: 0 !important;
          }
        `}
      />
      <Router>
        <Switch>
          <PrivateRoute path="/admin" component={Admin} />

          <Route component={Client} />
        </Switch>
      </Router>
      <PageLoader isActive={isLoading} />
    </>
  );
};
