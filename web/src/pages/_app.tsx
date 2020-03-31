import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { AppProps } from 'next/app';
import * as React from 'react';

import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import { AppStateProvider } from 'src/state/AppState';
import { IntlStateProvider } from 'src/state/IntlState';
import { RatesStateProvider } from 'src/state/RatesState';
import { UserStateProvider } from 'src/state/UserState';
import { defaultTheme } from 'src/themes';

import 'bulma/css/bulma.css';

const CustomNextApp = ({ Component, pageProps }: AppProps) => {
  return (
    <CacheProvider value={cache}>
      <DIProvider value={{ dependencies: makeDependenciesContainer() }}>
        <ThemeProvider theme={defaultTheme}>
          <AppStateProvider>
            <IntlStateProvider>
              <RatesStateProvider>
                <UserStateProvider>
                  <Component {...pageProps} />
                </UserStateProvider>
              </RatesStateProvider>
            </IntlStateProvider>
          </AppStateProvider>
        </ThemeProvider>
      </DIProvider>
    </CacheProvider>
  );
};

export default CustomNextApp;
