import * as React from "react";

import { withRouter } from "react-router";

import { injectAdminFeatureTypesState } from "src/state/AdminFeatureTypesState";
import { injectIntlState } from "src/state/IntlState";

import { injectIntl } from "react-intl";
import { injectDependencies } from "src/DI/DI";
import {
  AdminFeatureTypesEditPresenter,
  IProps
} from "./AdminFeatureTypesEditPresenter";
import { AdminFeatureTypesEditView } from "./AdminFeatureTypesEditView";

const ConnectedAdminFeatureTypesEditPresenter = injectIntlState(
  injectAdminFeatureTypesState(
    withRouter<IProps>(AdminFeatureTypesEditPresenter)
  )
);

export const AdminFeatureTypesEditContainer = injectDependencies(
  ({ dependencies }) => (
    <ConnectedAdminFeatureTypesEditPresenter
      View={injectIntl(AdminFeatureTypesEditView)}
      service={dependencies.services.featureType}
    />
  )
);
