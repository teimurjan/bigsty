import * as React from "react";

import { withRouter } from "react-router";

import { injectDependencies } from "src/DI/DI";
import { injectAdminCategoriesState } from "src/state/AdminCategoriesState";

import { AdminCategoriesDeletePresenter } from "./AdminCategoriesDeletePresenter";
import { AdminCategoriesDeleteView } from "./AdminCategoriesDeleteView";

const ConnectedAdminCategoriesDelete = injectAdminCategoriesState(
  withRouter(AdminCategoriesDeletePresenter)
);

export const AdminCategoriesDeleteContainer = injectDependencies(
  ({ dependencies, ...props }) => (
    <ConnectedAdminCategoriesDelete
      View={AdminCategoriesDeleteView}
      service={dependencies.services.category}
      {...props}
    />
  )
);
