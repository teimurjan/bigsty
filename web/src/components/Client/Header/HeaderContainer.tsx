import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';
import { useUserState } from 'src/state/UserState';

import { HeaderPresenter } from './HeaderPresenter';
import { HeaderView } from './HeaderView';

export const HeaderContainer = () => {
  const { dependencies } = useDependencies();
  const { appState } = useAppState();
  const { userState } = useUserState();

  return (
    <HeaderPresenter
      appState={appState}
      userState={userState}
      categoryService={dependencies.services.category}
      View={injectIntl(HeaderView)}
    />
  );
};
