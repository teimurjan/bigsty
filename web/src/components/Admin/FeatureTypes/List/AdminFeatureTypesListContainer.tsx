import * as React from 'react';

import { injectIntl } from 'react-intl';

import { injectIntlState } from 'src/state/IntlState';

import { injectAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { AdminFeatureTypesListPresenter } from './AdminFeatureTypesListPresenter';
import { AdminFeatureTypesListView } from './AdminFeatureTypesListView';

const ConnectedAdminFeatureTypesListPresenter = injectIntlState(AdminFeatureTypesListPresenter);

export const AdminFeatureTypesListContainer = injectAdminFeatureTypesState(props => (
  <ConnectedAdminFeatureTypesListPresenter View={injectIntl(AdminFeatureTypesListView)} {...props} />
));
