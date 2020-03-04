import * as React from 'react';

import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminProductTypesCreatePresenter } from './AdminProductTypesCreatePresenter';
import { AdminProductTypesCreateView } from './AdminProductTypesCreateView';

export const AdminProductTypesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminProductTypesState } = useAdminProductTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminProductTypesCreatePresenter
      history={history}
      View={injectIntl(AdminProductTypesCreateView)}
      service={dependencies.services.productType}
      intlState={intlState}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
      stateCacheStorage={dependencies.storages.stateCache}
    />
  );
};
