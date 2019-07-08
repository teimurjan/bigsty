import * as React from "react";

import { AdminCategoriesDeleteContainer } from "./Delete/AdminCategoriesDeleteContainer";
import { AdminCategoriesListContainer } from "./List/AdminCategoriesListContainer";

export const AdminCategories = () => (
  <>
    <AdminCategoriesListContainer />
    <AdminCategoriesDeleteContainer />
  </>
);
