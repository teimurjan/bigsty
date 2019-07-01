import * as React from "react";

import { Route } from "react-router";

import { AdminCategoriesContainer } from "./Categories/AdminCategoriesContainer";

interface IProps {
  match: { path: string };
}

export const Admin = ({ match }: IProps) => (
  <>
    <Route
      path={[match.path, `${match.path}/categories`]}
      component={AdminCategoriesContainer}
    />
  </>
);
