import * as React from "react";

import { IContextValue as AdminCategoriesContextValue } from "src/state/AdminCategoriesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { useTimeoutExpired } from "src/hooks/useTimeoutExpired";

export interface IProps {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  categories: AdminCategoriesContextValue["adminCategoriesState"]["categories"];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: {
    isListLoading,
    categories,
    getCategories,
    hasListLoaded
  },
  intlState: { availableLocales }
}: IProps & AdminCategoriesContextValue & IntlStateContextValue) => {
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading && isLoadingTimeoutExpired}
      locales={availableLocales.map(({ name }) => name)}
      categories={categories}
    />
  );
};
