import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAdminOrdersState } from 'src/state/AdminOrdersState';
import { useIntlState } from 'src/state/IntlState';

import { AdminOrdersListPresenter } from './AdminOrdersListPresenter';
import { AdminOrdersListView } from './AdminOrdersListView';

export const AdminOrdersListContainer = () => {
  const { intlState } = useIntlState();
  const { adminOrdersState } = useAdminOrdersState();

  return (
    <AdminOrdersListPresenter
      View={injectIntl(AdminOrdersListView)}
      adminOrdersState={adminOrdersState}
      intlState={intlState}
    />
  );
};
