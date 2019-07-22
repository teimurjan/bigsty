import * as React from "react";

import { Route, RouteComponentProps } from "react-router";

import { AdminFeatureTypesCreateContainer } from "./Create/AdminFeatureTypesCreateContainer";
import { AdminFeatureTypesDeleteContainer } from "./Delete/AdminFeatureTypesDeleteContainer";
import { AdminFeatureTypesListContainer } from "./List/AdminFeatureTypesListContainer";

export const AdminFeatureTypes = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminFeatureTypesListContainer />
    <AdminFeatureTypesDeleteContainer />

    <Route
      path={`${match.path}/new`}
      component={AdminFeatureTypesCreateContainer}
    />
  </>
);
