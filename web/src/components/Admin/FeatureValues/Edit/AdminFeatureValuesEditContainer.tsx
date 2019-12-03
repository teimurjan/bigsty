import * as React from 'react';

import { withRouter } from 'react-router';

import { injectAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { injectAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { injectIntlState } from 'src/state/IntlState';

import { injectIntl } from 'react-intl';
import { injectDependencies } from 'src/DI/DI';
import { AdminFeatureValuesEditPresenter, IProps } from './AdminFeatureValuesEditPresenter';
import { AdminFeatureValuesEditView } from './AdminFeatureValuesEditView';

const ConnectedAdminFeatureValuesEditPresenter = injectIntlState(
  injectAdminFeatureTypesState(injectAdminFeatureValuesState(withRouter<IProps>(AdminFeatureValuesEditPresenter))),
);

export const AdminFeatureValuesEditContainer = injectDependencies(({ dependencies }) => (
  <ConnectedAdminFeatureValuesEditPresenter
    View={injectIntl(AdminFeatureValuesEditView)}
    service={dependencies.services.featureValue}
  />
));
