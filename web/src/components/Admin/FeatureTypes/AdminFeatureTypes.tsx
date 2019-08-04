import * as React from "react";

import { Route, RouteComponentProps } from "react-router";

import { AdminFeatureTypesCreateContainer } from "./Create/AdminFeatureTypesCreateContainer";
import { AdminFeatureTypesDeleteContainer } from "./Delete/AdminFeatureTypesDeleteContainer";
import { AdminFeatureTypesEditContainer } from "./Edit/AdminFeatureTypesEditContainer";
import { AdminFeatureTypesListContainer } from "./List/AdminFeatureTypesListContainer";

export const AdminFeatureTypes = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminFeatureTypesListContainer />

    <Route
      path={`${match.path}/new`}
      component={AdminFeatureTypesCreateContainer}
    />
    <Route
      path={`${match.path}/delete/:id`}
      component={AdminFeatureTypesDeleteContainer}
    />
    <Route
      path={`${match.path}/edit/:id`}
      component={AdminFeatureTypesEditContainer}
    />
  </>
);
