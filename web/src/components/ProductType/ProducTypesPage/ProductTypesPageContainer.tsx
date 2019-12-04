import * as React from 'react';

import { useParams } from 'react-router';

import { useDependencies } from 'src/DI/DI';

import { ProductTypesListView } from '../ProductTypesList/ProductTypesListView';
import { ProductTypesPagePresenter } from './ProductTypesPagePresenter';

export const ProductTypesPageContainer = () => {
  const { dependencies } = useDependencies();
  const { categoryId } = useParams<{ categoryId: string }>();

  return (
    <ProductTypesPagePresenter
      categoryId={parseInt(categoryId, 10)}
      productTypeService={dependencies.services.productType}
      ListView={ProductTypesListView}
    />
  );
};
