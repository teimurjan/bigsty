import * as React from "react";

import { Route, RouteComponentProps } from "react-router";

import { AdminCategoriesCreateContainer } from "./Create/AdminCategoriesCreateContainer";
import { AdminCategoriesDeleteContainer } from "./Delete/AdminCategoriesDeleteContainer";
import { AdminCategoriesListContainer } from "./List/AdminCategoriesListContainer";

export const AdminCategories = ({ match }: RouteComponentProps) => (
  <>
    <AdminCategoriesListContainer />
    <AdminCategoriesDeleteContainer />

    <Route
      path={`${match.path}/new`}
      component={AdminCategoriesCreateContainer}
    />
  </>
);
