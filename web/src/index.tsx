import "bulma/css/bulma.css";
import { ThemeProvider } from "emotion-theming";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "./components/App/AppContainer";
import { makeDependenciesContainer } from "./DI/DependenciesContainer";
import { DIProvider } from "./DI/DI";
import registerServiceWorker from "./registerServiceWorker";
import { AppStateProvider } from "./state/AppState";
import { IntlStateProvider } from "./state/IntlState";
import { UserStateProvider } from "./state/UserState";
import { defaultTheme } from "./themes";

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
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
