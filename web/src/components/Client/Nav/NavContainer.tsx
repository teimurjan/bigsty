import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';


import { NavPresenter } from './NavPresenter';
import { NavView } from './NavView';

export const NavContainer = () => {
  const { appState } = useAppState();
  const { dependencies } = useDependencies();

  return (
    <NavPresenter View={injectIntl(NavView)} appState={appState} categoryService={dependencies.services.category} />
  );
};
