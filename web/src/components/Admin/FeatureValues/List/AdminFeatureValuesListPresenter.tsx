import * as React from 'react';

import { IContextValue as AdminFeatureValuesContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  featureValues: AdminFeatureValuesContextValue['adminFeatureValuesState']['featureValues'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminFeatureValuesListPresenter = ({
  View,
  adminFeatureValuesState: { isListLoading, featureValues, getFeatureValues, hasListLoaded },
  intlState: { availableLocales },
}: IProps & AdminFeatureValuesContextValue & IntlStateContextValue) => {
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    getFeatureValues();
  }, [getFeatureValues]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading && isLoadingTimeoutExpired}
      locales={availableLocales.map(({ name }) => name)}
      featureValues={featureValues}
    />
  );
};
