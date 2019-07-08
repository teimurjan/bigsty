import * as React from "react";

import { Route } from "react-router";

import { AdminCategoriesStateProvider } from "src/state/AdminCategoriesState";

import { AdminCategories } from "./Categories/AdminCategories";

interface IProps {
  match: { path: string };
}

export const Admin = ({ match }: IProps) => (
  <AdminCategoriesStateProvider>
    <Route
      path={[match.path, `${match.path}/categories`]}
      component={AdminCategories}
    />
  </AdminCategoriesStateProvider>
);
