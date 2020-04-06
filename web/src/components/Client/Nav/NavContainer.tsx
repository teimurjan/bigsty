import { withRouter } from 'next/router';
import * as React from 'react';

import { NavPresenter } from 'src/components/Client/Nav/NavPresenter';
import { NavView } from 'src/components/Client/Nav/NavView';
import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';

export const NavContainer = () => {
  const { appState } = useAppState();
  const { dependencies } = useDependencies();

  return (
    <NavPresenter View={withRouter(NavView)} appState={appState} categoryService={dependencies.services.category} />
  );
};
