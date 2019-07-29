import * as React from "react";

import { injectDependencies } from "src/DI/DI";

import { IDependenciesContainer } from "src/DI/DependenciesContainer";
import {
  IContextValue as AdminCategoriesContextValue,
  injectAdminCategoriesState
} from "src/state/AdminCategoriesState";
import { DeleteModalContainer } from "../../DeleteModal/DeleteModalContainer";

export interface IProps extends AdminCategoriesContextValue {
  dependencies: IDependenciesContainer;
}

export const AdminCategoriesDeleteContainer = injectAdminCategoriesState(
  injectDependencies(
    ({
      dependencies,
      adminCategoriesState: { hasListLoaded, deleteCategory, categories }
    }: IProps) => {
      const deleteEntity = React.useCallback(async (id: number) => {
        await deleteCategory(id);
        dependencies.services.category.delete(id);
      }, []);

      const doesEntityExists = React.useCallback(
        (id: number) =>
          hasListLoaded && categories.some(category => category.id === id),
        [hasListLoaded, categories.length]
      );

      return (
        <DeleteModalContainer
          deleteEntity={deleteEntity}
          doesEntityExists={doesEntityExists}
          backPath="/admin/categories"
        />
      );
    }
  )
);
