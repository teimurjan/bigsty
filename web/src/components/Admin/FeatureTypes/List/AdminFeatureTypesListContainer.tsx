import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useIntlState } from 'src/state/IntlState';

import { AdminFeatureTypesListPresenter } from './AdminFeatureTypesListPresenter';
import { AdminFeatureTypesListView } from './AdminFeatureTypesListView';

export const AdminFeatureTypesListContainer = () => {
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureTypesListPresenter
      View={injectIntl(AdminFeatureTypesListView)}
      adminFeatureTypesState={adminFeatureTypesState}
      intlState={intlState}
    />
  );
};
