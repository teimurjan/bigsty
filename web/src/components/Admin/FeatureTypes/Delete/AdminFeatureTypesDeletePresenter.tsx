import * as React from "react";

import { IContextValue as AdminFeatureTypesContextValue } from "src/state/AdminFeatureTypesState";

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  isOpen: boolean;
  delete_: () => any;
  isLoading: boolean;
  error: string | undefined;
  close: () => any;
}

export const AdminFeatureTypesDeletePresenter = ({
  View,
  adminFeatureTypesState: {
    isDeleteLoading,
    deleteError,
    deleteFeatureType,
    isDeleteOpen,
    closeDeletion
  }
}: IProps & AdminFeatureTypesContextValue) => (
  <View
    delete_={deleteFeatureType}
    close={closeDeletion}
    isOpen={isDeleteOpen}
    error={deleteError}
    isLoading={isDeleteLoading}
  />
);
