import * as React from 'react';

import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';

import { useDependencies } from 'src/DI/DI';

import { AdminProductsCreatePresenter } from './AdminProductsCreatePresenter';
import { AdminProductsCreateView } from './AdminProductsCreateView';
import { useAdminProductsState } from 'src/state/AdminProductsState';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsCreatePresenter
      history={history}
      View={injectIntl(AdminProductsCreateView)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
