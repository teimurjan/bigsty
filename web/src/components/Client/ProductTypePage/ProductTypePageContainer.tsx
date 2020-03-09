import * as React from 'react';

import { useParams } from 'react-router';

import { useDependencies } from 'src/DI/DI';
import { ProductTypePagePresenter } from './ProductTypePagePresenter';
import { ProductTypePageView } from './ProductTypePageView';

export const ProductTypePageContainer = () => {
  const { dependencies } = useDependencies();
  const { id } = useParams<{ id: string }>();

  return (
    <ProductTypePagePresenter
      id={parseInt(id, 10)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      cartStorage={dependencies.storages.cart}
      View={ProductTypePageView}
    />
  );
};
