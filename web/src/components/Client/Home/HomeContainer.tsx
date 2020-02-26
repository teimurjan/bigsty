import * as React from 'react';

import { useAppState } from 'src/state/AppState';

import { HomePresenter } from './HomePresenter';
import { HomeView } from './HomeView';
import { useDependencies } from 'src/DI/DI';

export const HomeContainer = () => {
  const { appState } = useAppState();
  const {
    dependencies: {
      services: { banner: bannerService, productType: productTypeService },
    },
  } = useDependencies();

  return (
    <HomePresenter
      appState={appState}
      bannerService={bannerService}
      productTypeService={productTypeService}
      View={HomeView}
    />
  );
};
