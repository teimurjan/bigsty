import * as React from 'react';

import { injectIntl } from 'react-intl';

import { useIntlState } from 'src/state/IntlState';
import { useAdminBannersState } from 'src/state/AdminBannersState';

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
