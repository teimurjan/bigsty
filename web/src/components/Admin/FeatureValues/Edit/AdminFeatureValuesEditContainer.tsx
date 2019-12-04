import * as React from 'react';

import { useHistory, useParams } from 'react-router';
import { injectIntl } from 'react-intl';

import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useIntlState } from 'src/state/IntlState';

import { useDependencies } from 'src/DI/DI';

import { AdminFeatureValuesEditPresenter } from './AdminFeatureValuesEditPresenter';
import { AdminFeatureValuesEditView } from './AdminFeatureValuesEditView';

export const AdminFeatureValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureValuesEditPresenter
      featureValueId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminFeatureValuesEditView)}
      service={dependencies.services.featureValue}
      intlState={intlState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
