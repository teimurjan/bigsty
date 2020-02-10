import * as React from 'react';

import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';

import { useDependencies } from 'src/DI/DI';

import { AdminProductsCreatePresenter } from './AdminProductsCreatePresenter';
import { AdminProductsCreateView } from './AdminProductsCreateView';
import { useAdminProductsState } from 'src/state/AdminProductsState';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { adminProductTypesState } = useAdminProductTypesState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsCreatePresenter
      history={history}
      View={injectIntl(AdminProductsCreateView)}
      service={dependencies.services.product}
      adminProductsState={adminProductsState}
      adminProductTypesState={adminProductTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
