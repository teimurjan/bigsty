import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useAdminProductsState } from 'src/state/AdminProductsState';

import { AdminProductsEditPresenter } from './AdminProductsEditPresenter';
import { AdminProductsEditView } from './AdminProductsEditView';

export const AdminProductsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsEditPresenter
      productId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminProductsEditView)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
