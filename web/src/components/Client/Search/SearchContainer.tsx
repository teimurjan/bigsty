import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { SearchPresenter } from './SearchPresenter';
import { SearchView } from './SearchView';

export const SearchContainer = () => {
  const { dependencies } = useDependencies();

  return <SearchPresenter View={SearchView} service={dependencies.services.search} />;
};
