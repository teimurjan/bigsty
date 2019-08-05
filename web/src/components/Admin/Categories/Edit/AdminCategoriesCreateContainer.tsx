import * as React from "react";

import { withRouter } from "react-router";

import { injectAdminCategoriesState } from "src/state/AdminCategoriesState";
import { injectIntlState } from "src/state/IntlState";

import { injectDependencies } from "src/DI/DI";
import { injectAdminFeatureTypesState } from "src/state/AdminFeatureTypesState";
import {
  AdminCategoriesEditPresenter,
  IProps
} from "./AdminCategoriesEditPresenter";
import { AdminCategoriesEditView } from "./AdminCategoriesEditView";

const ConnectedAdminCategoriesEditPresenter = injectIntlState(
  injectAdminFeatureTypesState(
    injectAdminCategoriesState(withRouter<IProps>(AdminCategoriesEditPresenter))
  )
);

export const AdminCategoriesEditContainer = injectDependencies(
  ({ dependencies }) => (
    <ConnectedAdminCategoriesEditPresenter
      View={AdminCategoriesEditView}
      service={dependencies.services.category}
    />
  )
);
