import * as React from 'react';

import { useAppState } from 'src/state/AppState';

import { AppPresenter } from './AppPresenter';
import { AppView } from './AppView';

export const AppContainer = () => {
  const { appState } = useAppState();

  return <AppPresenter View={AppView} appState={appState} />;
};
