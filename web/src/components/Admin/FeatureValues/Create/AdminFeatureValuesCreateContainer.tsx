import * as React from 'react';

import { withRouter } from 'react-router';

import { injectAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { injectAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { injectIntlState } from 'src/state/IntlState';

import { injectIntl } from 'react-intl';
import { injectDependencies } from 'src/DI/DI';
import { AdminFeatureValuesCreatePresenter, IProps } from './AdminFeatureValuesCreatePresenter';
import { AdminFeatureValuesCreateView } from './AdminFeatureValuesCreateView';

const ConnectedAdminFeatureValuesCreatePresenter = injectIntlState(
  injectAdminFeatureTypesState(injectAdminFeatureValuesState(withRouter<IProps>(AdminFeatureValuesCreatePresenter))),
);

export const AdminFeatureValuesCreateContainer = injectDependencies(({ dependencies }) => (
  <ConnectedAdminFeatureValuesCreatePresenter
    View={injectIntl(AdminFeatureValuesCreateView)}
    service={dependencies.services.featureValue}
  />
));
