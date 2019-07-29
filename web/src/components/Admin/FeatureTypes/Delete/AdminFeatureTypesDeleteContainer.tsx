import * as React from "react";

import { injectDependencies } from "src/DI/DI";

import { IDependenciesContainer } from "src/DI/DependenciesContainer";
import {
  IContextValue as AdminFeatureTypesContextValue,
  injectAdminFeatureTypesState
} from "src/state/AdminFeatureTypesState";
import { DeleteModalContainer } from "../../DeleteModal/DeleteModalContainer";

export interface IProps extends AdminFeatureTypesContextValue {
  dependencies: IDependenciesContainer;
}

export const AdminFeatureTypesDeleteContainer = injectAdminFeatureTypesState(
  injectDependencies(
    ({
      dependencies,
      adminFeatureTypesState: { hasListLoaded, deleteFeatureType, featureTypes }
    }: IProps) => {
      const deleteEntity = React.useCallback(async (id: number) => {
        await deleteFeatureType(id);
        dependencies.services.featureType.delete(id);
      }, []);

      const doesEntityExists = React.useCallback(
        (id: number) =>
          hasListLoaded &&
          featureTypes.some(featureType => featureType.id === id),
        [hasListLoaded, featureTypes.length]
      );

      return (
        <DeleteModalContainer
          deleteEntity={deleteEntity}
          doesEntityExists={doesEntityExists}
          backPath="/admin/featureTypes"
        />
      );
    }
  )
);
