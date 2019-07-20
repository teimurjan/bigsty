import * as React from "react";

import { IContextValue as AdminFeatureTypesContextValue } from "src/state/AdminFeatureTypesState";
import { IContextValue as IntlStateContextValue } from "src/state/IntlState";

import { useTimeoutExpired } from "src/hooks/useTimeoutExpired";

export interface IProps {
  View: React.ComponentClass<IViewProps>;
}

export interface IViewProps {
  featureTypes: AdminFeatureTypesContextValue["adminFeatureTypesState"]["featureTypes"];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
  openDeletion: (id: number) => any;
}

export const AdminFeatureTypesListPresenter = ({
  View,
  adminFeatureTypesState: {
    isListLoading,
    openDeletion,
    featureTypes,
    getFeatureTypes,
    hasListLoaded
  },
  intlState: { availableLocales }
}: IProps & AdminFeatureTypesContextValue & IntlStateContextValue) => {
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    getFeatureTypes();
  }, []);

  return (
    <View
      isDataLoaded={hasListLoaded}
      openDeletion={openDeletion}
      isLoading={isListLoading && isLoadingTimeoutExpired}
      locales={availableLocales.map(({ name }) => name)}
      featureTypes={featureTypes}
    />
  );
};
