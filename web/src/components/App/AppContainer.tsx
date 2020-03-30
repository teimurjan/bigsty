import * as React from 'react';


import { AppPresenter } from 'src/components/App/AppPresenter';
import { AppView } from 'src/components/App/AppView';
import { useAppState } from 'src/state/AppState';

export const AppContainer = () => {
  const { appState } = useAppState();

  return <AppPresenter View={AppView} appState={appState} />;
};
