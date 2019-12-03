import * as React from 'react';

import { injectIntl } from 'react-intl';

import { injectIntlState } from 'src/state/IntlState';

import { injectAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { AdminCategoriesListPresenter } from './AdminCategoriesListPresenter';
import { AdminCategoriesListView } from './AdminCategoriesListView';

const ConnectedAdminCategoriesListPresenter = injectIntlState(AdminCategoriesListPresenter);

export const AdminCategoriesListContainer = injectAdminCategoriesState(props => (
  <ConnectedAdminCategoriesListPresenter View={injectIntl(AdminCategoriesListView)} {...props} />
));
