import * as React from 'react';

import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminCategoriesCreatePresenter } from './AdminCategoriesCreatePresenter';
import { AdminCategoriesCreateView } from './AdminCategoriesCreateView';

export const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { intlState } = useIntlState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={injectIntl(AdminCategoriesCreateView)}
      service={dependencies.services.category}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
