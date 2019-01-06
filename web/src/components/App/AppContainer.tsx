import * as React from "react";
import { injectAppState } from "src/state/AppState";
import { AppPresenter } from "./AppPresenter";
import { AppView } from "./AppView";

const ConnectedApp = injectAppState(AppPresenter);

export const AppContainer = () => <ConnectedApp View={AppView} />;
