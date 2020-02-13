import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { HomePagePresenter } from './HomePagePresenter';
import { HomePageView } from './HomePageView';

export const HomePageContainer = () => {
  const { dependencies } = useDependencies();

  return <HomePagePresenter View={HomePageView} categoryService={dependencies.services.category} />;
};
