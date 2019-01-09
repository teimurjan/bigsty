import * as React from "react";
import { injectDependencies } from "src/DI/DI";
import { injectAppState } from "src/state/AppState";
import { HeaderPresenter } from "./HeaderPresenter";
import { HeaderView } from "./HeaderView";

const ConnectedHeaderPresenter = injectAppState(HeaderPresenter);

export const HeaderContainer = injectDependencies(({ dependencies }) => (
  <ConnectedHeaderPresenter
    service={dependencies.services.category}
    View={HeaderView}
  />
));
