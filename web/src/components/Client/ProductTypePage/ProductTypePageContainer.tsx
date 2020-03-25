import * as React from 'react';

import { useParams } from 'react-router';

import { useDependencies } from 'src/DI/DI';
import { ProductTypePagePresenter } from './ProductTypePagePresenter';
import { ProductTypePageView } from './ProductTypePageView';
import { useIntl } from 'react-intl';

export const ProductTypePageContainer = () => {
  const { dependencies } = useDependencies();
  const { id } = useParams<{ id: string }>();

  const intl = useIntl();

  return (
    <ProductTypePagePresenter
      action={dependencies.storages.cart.add}
      actionText={intl.formatMessage({ id: 'common.addToCart' })}
      id={parseInt(id, 10)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      View={ProductTypePageView}
    />
  );
};
