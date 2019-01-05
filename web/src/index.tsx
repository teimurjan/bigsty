import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";
import { makeDependenciesContainer } from "./DI/DependenciesContainer";
import { DIProvider } from "./DI/DI";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <DIProvider value={makeDependenciesContainer()}>
    <App />
  </DIProvider>,
  document.getElementById("root") as HTMLElement
);

registerServiceWorker();
