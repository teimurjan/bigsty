import * as React from 'react';

import { useAppState } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

import { HeaderPresenter, IViewProps } from './HeaderPresenter';
import { HeaderView } from './HeaderView';

export const HeaderContainer = (props: Pick<IViewProps, 'nav' | 'cart'>) => {
  const { appState } = useAppState();
  const { userState } = useUserState();

  return <HeaderPresenter appState={appState} userState={userState} View={HeaderView} {...props} />;
};
