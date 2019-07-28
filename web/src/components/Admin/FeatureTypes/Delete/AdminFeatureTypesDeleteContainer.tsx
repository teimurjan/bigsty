import * as React from "react";

import { withRouter } from "react-router";

import { injectDependencies } from "src/DI/DI";
import { injectAdminFeatureTypesState } from "src/state/AdminFeatureTypesState";

import { AdminFeatureTypesDeletePresenter } from "./AdminFeatureTypesDeletePresenter";
import { AdminFeatureTypesDeleteView } from "./AdminFeatureTypesDeleteView";

const ConnectedAdminFeatureTypesDelete = injectAdminFeatureTypesState(
  withRouter(AdminFeatureTypesDeletePresenter)
);

export const AdminFeatureTypesDeleteContainer = injectDependencies(
  ({ dependencies, ...props }) => (
    <ConnectedAdminFeatureTypesDelete
      View={AdminFeatureTypesDeleteView}
      service={dependencies.services.featureType}
      {...props}
    />
  )
);
