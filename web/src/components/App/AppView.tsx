import { Global, css } from '@emotion/core';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { BrowserRouter, StaticRouter, Route, Switch } from 'react-router-dom';

import logo from 'src/assets/images/logo.png';
import { Admin } from 'src/components/Admin/Admin';
import { Client } from 'src/components/Client/Client';
import { PageLoader } from 'src/components/common/PageLoader/PageLoader';
import { ConfirmSignupContainer } from 'src/components/ConfirmSignup/ConfirmSignupContainer';
import { PrivateRoute } from 'src/components/PrivateRoute';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { safeWindow } from 'src/utils/dom';

const Router = process.env.REACT_APP_USE_STATIC_ROUTER ? StaticRouter : BrowserRouter;

interface IProps {
  isLoading: boolean;
}

const CUSTOM_OG_PAGES_REGEXES = [/^\/products\/\d+/g];

export const AppView = ({ isLoading }: IProps) => {
  const { iconPathPrefix, manifestPath } = useMedia(
    [mediaQueries.darkMode],
    [{ iconPathPrefix: '/dark-icon', manifestPath: '/dark-manifest.json' }],
    { iconPathPrefix: '/icon', manifestPath: '/manifest.json' },
  );

  const intl = useIntl();

  const isCustomOGPage = safeWindow(w => CUSTOM_OG_PAGES_REGEXES.some(r => w.location.pathname.match(r)), false);

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
        {!isCustomOGPage && <meta name="og:title" content={intl.formatMessage({ id: 'Meta.title' })} />}
        {!isCustomOGPage && <meta name="og:description" content={intl.formatMessage({ id: 'Meta.description' })} />}
        {!isCustomOGPage && <meta name="og:image" content={logo} />}
        {!isCustomOGPage && <meta name="og:type" content="website" />}
        <meta name="og:site_name" content="eye8.kg" />
        <meta name="og:url" content={safeWindow(w => w.location.href, '')} />
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
      {React.createElement(
        Router,
        {},
        <Switch>
          <PrivateRoute path="/admin" component={Admin} />
          <Route path="/auth/register/confirm" component={ConfirmSignupContainer} />

          <Route component={Client} />
        </Switch>,
      )}
      <PageLoader isActive={isLoading} />
    </>
  );
};
