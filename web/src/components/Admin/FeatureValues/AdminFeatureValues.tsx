import * as React from "react";

import { Route, RouteComponentProps } from "react-router";

import { AdminFeatureValuesCreateContainer } from "./Create/AdminFeatureValuesCreateContainer";
import { AdminFeatureValuesDeleteContainer } from "./Delete/AdminFeatureValuesDeleteContainer";
import { AdminFeatureValuesEditContainer } from "./Edit/AdminFeatureValuesEditContainer";
import { AdminFeatureValuesListContainer } from "./List/AdminFeatureValuesListContainer";

export const AdminFeatureValues = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminFeatureValuesListContainer />

    <Route
      path={`${match.path}/new`}
      component={AdminFeatureValuesCreateContainer}
    />
    <Route
      path={`${match.path}/delete/:id`}
      component={AdminFeatureValuesDeleteContainer}
    />
    <Route
      path={`${match.path}/edit/:id`}
      component={AdminFeatureValuesEditContainer}
    />
  </>
);
