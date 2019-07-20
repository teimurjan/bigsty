import * as React from "react";

import { AdminFeatureTypesDeleteContainer } from "./Delete/AdminFeatureTypesDeleteContainer";
import { AdminFeatureTypesListContainer } from "./List/AdminFeatureTypesListContainer";

export const AdminFeatureTypes = () => (
  <>
    <AdminFeatureTypesListContainer />
    <AdminFeatureTypesDeleteContainer />
  </>
);
