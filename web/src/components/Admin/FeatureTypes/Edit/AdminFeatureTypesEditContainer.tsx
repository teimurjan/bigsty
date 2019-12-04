import * as React from 'react';

import { useHistory, useParams } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminFeatureTypesEditPresenter } from './AdminFeatureTypesEditPresenter';
import { AdminFeatureTypesEditView } from './AdminFeatureTypesEditView';

export const AdminFeatureTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureTypesEditPresenter
      featureTypeId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminFeatureTypesEditView)}
      service={dependencies.services.featureType}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
