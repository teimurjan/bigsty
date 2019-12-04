import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useIntlState } from 'src/state/IntlState';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';

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
