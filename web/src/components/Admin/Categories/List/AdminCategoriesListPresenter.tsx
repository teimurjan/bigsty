import * as React from "react";

import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { IContextValue as AdminCategoriesContextValue } from "src/state/AdminCategoriesState";

export interface IProps {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  categories: AdminCategoriesContextValue["adminCategoriesState"]["categories"];
  isLoading: boolean;
  locales: string[];
  openDeletion: (id: number) => any;
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: {
    isListLoading,
    openDeletion,
    categories,
    getCategories
  },
  intlState: { availableLocales }
}: IProps & AdminCategoriesContextValue & IntlStateContextValue) => {
  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <View
      openDeletion={openDeletion}
      isLoading={isListLoading}
      locales={availableLocales.map(({ name }) => name)}
      categories={categories}
    />
  );
};
