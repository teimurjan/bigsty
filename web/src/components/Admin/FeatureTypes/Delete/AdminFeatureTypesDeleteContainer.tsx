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
      adminFeatureTypesState: { deleteFeatureType }
    }: IProps) => {
      const deleteEntity = React.useCallback(async (id: number) => {
        await deleteFeatureType(id);
        dependencies.services.featureType.delete(id);
      }, []);

      const preloadData = React.useCallback(async ({ id, setError, setIsLoading }) => {
        try {
          setIsLoading(true);
          const isExists = await dependencies.services.featureType.exists(id);
          if (!isExists) {
            setError("AdminFeatureTypes.notFound");
          }
        } catch (e) {
          setError("errors.common");
        } finally {
          setIsLoading(false);
        }
      }, []);

      return (
        <DeleteModalContainer
          deleteEntity={deleteEntity}
          preloadData={preloadData}
          backPath="/admin/featureTypes"
        />
      );
    }
  )
);
