import { ThemeProvider } from 'emotion-theming';
import * as React from 'react';

import { AppContainer } from 'src/components/App/AppContainer';
import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import { AppStateProvider } from 'src/state/AppState';
import { IntlStateProvider } from 'src/state/IntlState';
import { RatesStateProvider } from 'src/state/RatesState';
import { UserStateProvider } from 'src/state/UserState';
import { defaultTheme } from 'src/themes';


export const ConnectedApp = () => (
  <DIProvider value={{ dependencies: makeDependenciesContainer() }}>
    <ThemeProvider theme={defaultTheme}>
      <AppStateProvider>
        <IntlStateProvider>
          <RatesStateProvider>
            <UserStateProvider>
              <AppContainer />
            </UserStateProvider>
          </RatesStateProvider>
        </IntlStateProvider>
      </AppStateProvider>
    </ThemeProvider>
  </DIProvider>
);

