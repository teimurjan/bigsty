import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ThemeProvider } from 'emotion-theming';

import { AppContainer } from 'src/components/App/AppContainer';
import { AppStateProvider } from 'src/state/AppState';
import { IntlStateProvider } from 'src/state/IntlState';
import { UserStateProvider } from 'src/state/UserState';

import { DIProvider } from 'src/DI/DI';
import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';

import { defaultTheme } from 'src/themes';

import registerServiceWorker from 'src/registerServiceWorker';

import 'bulma/css/bulma.css';
import { RatesStateProvider } from './state/RatesState';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    collapseGroups: true,
  });
}

ReactDOM.render(
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
  </DIProvider>,
  document.getElementById('root') as HTMLElement,
);

registerServiceWorker();
