import * as React from "react";

import { Route, Switch } from "react-router";

import { AdminCategoriesStateProvider } from "src/state/AdminCategoriesState";
import { AdminFeatureTypesStateProvider } from "src/state/AdminFeatureTypesState";
import { AdminFeatureValuesStateProvider } from "src/state/AdminFeatureValuesState";

import { AdminCategories } from "./Categories/AdminCategories";
import { AdminFeatureTypes } from "./FeatureTypes/AdminFeatureTypes";
import { AdminFeatureValues } from "./FeatureValues/AdminFeatureValues";

import { AdminHeaderContainer } from "./Header/AdminHeaderContainer";

interface IProps {
  match: { path: string };
}

export const Admin = ({ match }: IProps) => (
  <AdminCategoriesStateProvider>
    <AdminFeatureTypesStateProvider>
      <AdminFeatureValuesStateProvider>
        <AdminHeaderContainer />
        <Switch>
          <Route
            path={`${match.path}/categories`}
            component={AdminCategories}
          />
          <Route
            path={`${match.path}/featureTypes`}
            component={AdminFeatureTypes}
          />
          <Route
            path={`${match.path}/featureValues`}
            component={AdminFeatureValues}
          />
        </Switch>
      </AdminFeatureValuesStateProvider>
    </AdminFeatureTypesStateProvider>
  </AdminCategoriesStateProvider>
);
