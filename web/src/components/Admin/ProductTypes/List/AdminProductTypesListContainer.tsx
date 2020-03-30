import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';
import { useIntlState } from 'src/state/IntlState';

import { AdminProductTypesListPresenter } from './AdminProductTypesListPresenter';
import { AdminProductTypesListView } from './AdminProductTypesListView';

export const AdminProductTypesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminProductTypesState } = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter
      View={injectIntl(AdminProductTypesListView)}
      adminProductTypesState={adminProductTypesState}
      intlState={intlState}
    />
  );
};
