import * as React from "react";

import { IContextValue as AdminCategoriesContextValue } from "src/state/AdminCategoriesState";

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

export const AdminCategoriesDeletePresenter = ({
  View,
  adminCategoriesState: {
    isDeleteLoading,
    deleteError,
    deleteCategory,
    isDeleteOpen,
    closeDeletion
  }
}: IProps & AdminCategoriesContextValue) => (
  <View
    delete_={deleteCategory}
    close={closeDeletion}
    isOpen={isDeleteOpen}
    error={deleteError}
    isLoading={isDeleteLoading}
  />
);
