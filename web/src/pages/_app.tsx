import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { AppProps, AppContext } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { createIntl, createIntlCache } from 'react-intl';

import { PageLoader } from 'src/components/common/PageLoader/PageLoader';
import { PageProgressBar } from 'src/components/PageProgressBar/PageProgressBar';
import { dependenciesFactory, IDependenciesFactoryArgs } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import { useMedia } from 'src/hooks/useMedia';
import { AppStateProvider, useAppState } from 'src/state/AppState';
import { CategoriesStateProvider } from 'src/state/CategoriesState';
import { IntlStateProvider } from 'src/state/IntlState';
import { RatesStateProvider } from 'src/state/RatesState';
import { UserStateProvider, useUserState } from 'src/state/UserState';
import { mediaQueries } from 'src/styles/media';
import { defaultTheme } from 'src/themes';
import { withPublicURL } from 'src/utils/url';

import 'bulma/css/bulma.css';

const intlCache = createIntlCache();

const EntryPoint = ({ children }: { children: React.ReactElement }) => {
  const {
    userState: { syncUser },
  } = useUserState();

  React.useEffect(() => {
    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

const CustomHead = () => {
  const intl = useIntl();
  const router = useRouter();

  const { iconFolder, manifestName } = useMedia(
    [mediaQueries.darkMode],
    [{ iconFolder: 'dark-icon', manifestName: 'dark-manifest.json' }],
    { iconFolder: 'icon', manifestName: 'manifest.json' },
  );

  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href={withPublicURL(`${iconFolder}/apple-touch-icon.png`)} />
      <link rel="icon" type="image/png" sizes="32x32" href={withPublicURL(`${iconFolder}/favicon-32x32.png`)} />
      <link rel="icon" type="image/png" sizes="16x16" href={withPublicURL(`${iconFolder}/favicon-16x16.png`)} />
      <link rel="shortcut icon" href={withPublicURL(`${iconFolder}/favicon.ico`)} />
      <link rel="manifest" href={withPublicURL(manifestName)} />
      <title>{intl.formatMessage({ id: 'Meta.title' })}</title>
      <meta name="description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta name="keywords" content={intl.formatMessage({ id: 'Meta.keywords' })} />
      <meta name="og:site_name" content="Eye8" />
      <meta name="og:url" content={withPublicURL(router.asPath)} />
      <meta name="og:title" content={intl.formatMessage({ id: 'Meta.title' })} />
      <meta name="og:description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta name="og:image" content={withPublicURL('img/preview.jpg')} />
      <meta name="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={withPublicURL(router.asPath)} />
      <meta name="twitter:title" content={intl.formatMessage({ id: 'Meta.title' })} />
      <meta name="twitter:description" content={intl.formatMessage({ id: 'Meta.description' })} />
      <meta name="twitter:image:src" content={withPublicURL('img/preview.jpg')} />
    </Head>
  );
};

const LoadingOverlay = () => {
  const {
    appState: { isLoading },
  } = useAppState();

  return <PageLoader isActive={isLoading} />;
};

const CustomNextApp = ({
  Component,
  pageProps,
  locale,
  messages,
  componentsInitialProps,
}: AppProps & Then<ReturnType<typeof getInitialProps>>) => {
  const intl = createIntl(
    {
      locale,
      messages,
    },
    intlCache,
  );

  return (
    <CacheProvider value={cache}>
      <DIProvider value={{ dependencies: dependenciesFactory() }}>
        <ThemeProvider theme={defaultTheme}>
          <AppStateProvider>
            <IntlStateProvider
              initialProps={{
                availableLocales: componentsInitialProps.intlState.availableLocales,
                error: componentsInitialProps.intlState.error,
              }}
              intl={intl}
            >
              <RatesStateProvider>
                <UserStateProvider>
                  <CategoriesStateProvider initialProps={componentsInitialProps.categoriesState}>
                    <EntryPoint>
                      <>
                        <CustomHead />
                        <PageProgressBar />
                        <Component {...pageProps} />
                        <LoadingOverlay />
                      </>
                    </EntryPoint>
                  </CategoriesStateProvider>
                </UserStateProvider>
              </RatesStateProvider>
            </IntlStateProvider>
          </AppStateProvider>
        </ThemeProvider>
      </DIProvider>
    </CacheProvider>
  );
};

const getComponentsInitialProps = async (args: IDependenciesFactoryArgs) => {
  const {
    services: { category: categoryService, intl: intlService },
  } = dependenciesFactory(args);
  try {
    const { entities, result } = await categoryService.getAll();
    const availableLocales = await intlService.getAvailableLocales();
    return {
      categoriesState: { categories: entities.categories, categoriesOrder: result },
      intlState: { availableLocales },
    };
  } catch (e) {
    return {
      categoriesState: { categories: {}, categoriesOrder: [], error: 'errors.common' },
      intlState: { availableLocales: [], error: 'errors.common' },
    };
  }
};

const getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  const { req, res } = ctx;
  const { locale, messages } = req || (window as any).__NEXT_DATA__.props;

  return {
    pageProps,
    locale,
    messages,
    componentsInitialProps: await getComponentsInitialProps({ req, res }),
  };
};

CustomNextApp.getInitialProps = getInitialProps;

export default CustomNextApp;
