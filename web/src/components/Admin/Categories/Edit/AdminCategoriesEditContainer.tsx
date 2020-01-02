import * as React from 'react';

import { useHistory, useParams } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminCategoriesEditPresenter } from './AdminCategoriesEditPresenter';
import { AdminCategoriesEditView } from './AdminCategoriesEditView';

export const AdminCategoriesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { intlState } = useIntlState();

  return (
    <AdminCategoriesEditPresenter
      categoryId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminCategoriesEditView)}
      service={dependencies.services.category}
      intlState={intlState}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
