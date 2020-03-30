import * as React from 'react';
import { injectIntl } from 'react-intl';

import { NavPresenter } from 'src/components/Client/Nav/NavPresenter';
import { NavView } from 'src/components/Client/Nav/NavView';
import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';



export const NavContainer = () => {
  const { appState } = useAppState();
  const { dependencies } = useDependencies();

  return (
    <NavPresenter View={injectIntl(NavView)} appState={appState} categoryService={dependencies.services.category} />
  );
};
