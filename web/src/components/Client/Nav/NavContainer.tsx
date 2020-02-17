import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useAppState } from 'src/state/AppState';

import { NavPresenter } from './NavPresenter';
import { NavView } from './NavView';
import { useDependencies } from 'src/DI/DI';

export const NavContainer = () => {
  const { appState } = useAppState();
  const { dependencies } = useDependencies();

  return (
    <NavPresenter View={injectIntl(NavView)} appState={appState} categoryService={dependencies.services.category} />
  );
};
