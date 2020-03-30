import * as React from 'react';
import { useParams } from 'react-router';

import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { ProductTypesPagePresenter } from 'src/components/Client/ProducTypesPage/ProductTypesPagePresenter';
import { useDependencies } from 'src/DI/DI';



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
