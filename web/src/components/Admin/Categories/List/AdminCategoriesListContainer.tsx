import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

import { AdminCategoriesListPresenter } from './AdminCategoriesListPresenter';
import { AdminCategoriesListView } from './AdminCategoriesListView';

export const AdminCategoriesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminCategoriesState } = useAdminCategoriesState();

  return (
    <AdminCategoriesListPresenter
      View={injectIntl(AdminCategoriesListView)}
      adminCategoriesState={adminCategoriesState}
      intlState={intlState}
    />
  );
};
