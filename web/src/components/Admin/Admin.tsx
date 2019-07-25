import * as React from "react";

import { Route, Switch } from "react-router";

import { AdminCategoriesStateProvider } from "src/state/AdminCategoriesState";

import { AdminFeatureTypesStateProvider } from "src/state/AdminFeatureTypesState";
import { AdminCategories } from "./Categories/AdminCategories";
import { AdminFeatureTypes } from "./FeatureTypes/AdminFeatureTypes";
import { AdminHeaderContainer } from "./Header/AdminHeaderContainer";

interface IProps {
  match: { path: string };
}

export const Admin = ({ match }: IProps) => (
  <AdminCategoriesStateProvider>
    <AdminFeatureTypesStateProvider>
      <AdminHeaderContainer />
      <Switch>
        <Route path={`${match.path}/categories`} component={AdminCategories} />
        <Route
          path={`${match.path}/featureTypes`}
          component={AdminFeatureTypes}
        />
      </Switch>
    </AdminFeatureTypesStateProvider>
  </AdminCategoriesStateProvider>
);
