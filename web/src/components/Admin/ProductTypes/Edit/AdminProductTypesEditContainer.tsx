import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';
import { useIntlState } from 'src/state/IntlState';


import { AdminProductTypesEditPresenter } from './AdminProductTypesEditPresenter';
import { AdminProductTypesEditView } from './AdminProductTypesEditView';

export const AdminProductTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminProductTypesState } = useAdminProductTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminProductTypesEditPresenter
      productTypeId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminProductTypesEditView)}
      service={dependencies.services.productType}
      intlState={intlState}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
