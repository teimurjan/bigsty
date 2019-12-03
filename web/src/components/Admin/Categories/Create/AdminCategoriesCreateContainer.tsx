import * as React from 'react';

import { withRouter } from 'react-router';

import { injectAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { injectIntlState } from 'src/state/IntlState';

import { injectDependencies } from 'src/DI/DI';
import { injectAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { AdminCategoriesCreatePresenter, IProps } from './AdminCategoriesCreatePresenter';
import { AdminCategoriesCreateView } from './AdminCategoriesCreateView';

const ConnectedAdminCategoriesCreatePresenter = injectIntlState(
  injectAdminFeatureTypesState(injectAdminCategoriesState(withRouter<IProps>(AdminCategoriesCreatePresenter))),
);

export const AdminCategoriesCreateContainer = injectDependencies(({ dependencies }) => (
  <ConnectedAdminCategoriesCreatePresenter View={AdminCategoriesCreateView} service={dependencies.services.category} />
));
