import * as React from "react";

import { injectAdminCategoriesState } from "src/state/AdminCategoriesState";
import { AdminCategoriesDeletePresenter } from "./AdminCategoriesDeletePresenter";
import { AdminCategoriesDeleteView } from "./AdminCategoriesDeleteView";

export const AdminCategoriesDeleteContainer = injectAdminCategoriesState(
  props => (
    <AdminCategoriesDeletePresenter
      View={AdminCategoriesDeleteView}
      {...props}
    />
  )
);
