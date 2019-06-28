import * as React from "react";
import { withRouter } from "react-router";

import { injectDependencies } from "src/DI/DI";

import { ProductTypesListView } from "../ProductTypesList/ProductTypesListView";
import { ProductTypesPagePresenter } from "./ProductTypesPagePresenter";

const ConnectedProductTypesPagePresenter = withRouter(
  ProductTypesPagePresenter
);

export const ProductTypesPageContainer = injectDependencies(
  ({ dependencies }) => (
    <ConnectedProductTypesPagePresenter
      productTypeService={dependencies.services.productType}
      ListView={ProductTypesListView}
    />
  )
);
