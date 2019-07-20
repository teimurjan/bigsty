import * as React from "react";

import { injectAdminFeatureTypesState } from "src/state/AdminFeatureTypesState";
import { AdminFeatureTypesDeletePresenter } from "./AdminFeatureTypesDeletePresenter";
import { AdminFeatureTypesDeleteView } from "./AdminFeatureTypesDeleteView";

export const AdminFeatureTypesDeleteContainer = injectAdminFeatureTypesState(
  props => (
    <AdminFeatureTypesDeletePresenter
      View={AdminFeatureTypesDeleteView}
      {...props}
    />
  )
);
