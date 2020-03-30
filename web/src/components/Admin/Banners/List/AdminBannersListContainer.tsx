import * as React from 'react';
import { injectIntl } from 'react-intl';

import { useAdminBannersState } from 'src/state/AdminBannersState';
import { useIntlState } from 'src/state/IntlState';

import { AdminBannersListPresenter } from './AdminBannersListPresenter';
import { AdminBannersListView } from './AdminBannersListView';

export const AdminBannersListContainer = () => {
  const { intlState } = useIntlState();
  const { adminBannersState } = useAdminBannersState();

  return (
    <AdminBannersListPresenter
      View={injectIntl(AdminBannersListView)}
      adminBannersState={adminBannersState}
      intlState={intlState}
    />
  );
};
