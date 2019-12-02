import * as React from "react";

import { injectDependencies } from "src/DI/DI";

import { IDependenciesContainer } from "src/DI/DependenciesContainer";
import {
  IContextValue as AdminFeatureValuesContextValue,
  injectAdminFeatureValuesState
} from "src/state/AdminFeatureValuesState";
import { DeleteModalContainer } from "../../DeleteModal/DeleteModalContainer";

export interface IProps extends AdminFeatureValuesContextValue {
  dependencies: IDependenciesContainer;
}

export const AdminFeatureValuesDeleteContainer = injectAdminFeatureValuesState(
  injectDependencies(
    ({
      dependencies,
      adminFeatureValuesState: { deleteFeatureValue }
    }: IProps) => {
      const deleteEntity = React.useCallback(async (id: number) => {
        await deleteFeatureValue(id);
        dependencies.services.featureValue.delete(id);
      }, []);

      const preloadData = React.useCallback(async ({ id, setError, setIsLoading }) => {
        try {
          setIsLoading(true);
          const isExists = await dependencies.services.featureValue.exists(id);
          if (!isExists) {
            setError("AdminFeatureValues.notFound");
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
          backPath="/admin/featureValues"
        />
      );
    }
  )
);
