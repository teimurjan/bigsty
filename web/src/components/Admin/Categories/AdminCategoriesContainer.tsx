import * as React from "react";

import { injectIntl } from "react-intl";

import { injectDependencies } from "src/DI/DI";

import { injectIntlState } from "src/state/IntlState";

import { AdminCategoriesPresenter } from "./AdminCategoriesPresenter";
import { AdminCategoriesView } from "./AdminCategoriesView";

const ConnectedAdminCategoriesPresenter = injectIntlState(
  AdminCategoriesPresenter
);

export const AdminCategoriesContainer = injectDependencies(
  ({ dependencies }) => (
    <ConnectedAdminCategoriesPresenter
      categoryService={dependencies.services.category}
      View={injectIntl(AdminCategoriesView)}
    />
  )
);
