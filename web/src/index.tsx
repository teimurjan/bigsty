import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ThemeProvider } from 'emotion-theming';

import { AppContainer } from 'src/components/App/AppContainer';
import { makeDependenciesContainer } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import registerServiceWorker from 'src/registerServiceWorker';
import { AppStateProvider } from 'src/state/AppState';
import { IntlStateProvider } from 'src/state/IntlState';
import { UserStateProvider } from 'src/state/UserState';
import { defaultTheme } from 'src/themes';

import 'bulma/css/bulma.css';

ReactDOM.render(
  <DIProvider value={{ dependencies: makeDependenciesContainer() }}>
    <ThemeProvider theme={defaultTheme}>
      <AppStateProvider>
        <IntlStateProvider>
          <UserStateProvider>
            <AppContainer />
          </UserStateProvider>
        </IntlStateProvider>
      </AppStateProvider>
    </ThemeProvider>
  </DIProvider>,
  document.getElementById('root') as HTMLElement,
);

registerServiceWorker();
