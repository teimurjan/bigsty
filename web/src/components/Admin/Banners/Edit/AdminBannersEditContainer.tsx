import * as React from 'react';

import { useHistory, useParams } from 'react-router';

import { useAdminBannersState } from 'src/state/AdminBannersState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminBannersEditPresenter } from './AdminBannersEditPresenter';
import { AdminBannersEditView } from './AdminBannersEditView';

export const AdminBannersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminBannersState } = useAdminBannersState();
  const { intlState } = useIntlState();

  return (
    <AdminBannersEditPresenter
      bannerId={parseInt(params.id, 10)}
      history={history}
      View={AdminBannersEditView}
      service={dependencies.services.banner}
      intlState={intlState}
      adminBannersState={adminBannersState}
    />
  );
};
