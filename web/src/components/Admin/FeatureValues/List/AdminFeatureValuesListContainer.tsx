import * as React from 'react';

import { injectIntl } from 'react-intl';

import { injectIntlState } from 'src/state/IntlState';

import { injectAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { AdminFeatureValuesListPresenter } from './AdminFeatureValuesListPresenter';
import { AdminFeatureValuesListView } from './AdminFeatureValuesListView';

const ConnectedAdminFeatureValuesListPresenter = injectIntlState(AdminFeatureValuesListPresenter);

export const AdminFeatureValuesListContainer = injectAdminFeatureValuesState(props => (
  <ConnectedAdminFeatureValuesListPresenter View={injectIntl(AdminFeatureValuesListView)} {...props} />
));
