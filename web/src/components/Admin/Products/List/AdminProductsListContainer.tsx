import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useIntlState } from 'src/state/IntlState';
import { useAdminProductsState } from 'src/state/AdminProductsState';

import { AdminProductsListPresenter } from './AdminProductsListPresenter';
import { AdminProductsListView } from './AdminProductsListView';

export const AdminProductsListContainer = () => {
  const { intlState } = useIntlState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsListPresenter
      View={injectIntl(AdminProductsListView)}
      adminProductsState={adminProductsState}
      intlState={intlState}
    />
  );
};
