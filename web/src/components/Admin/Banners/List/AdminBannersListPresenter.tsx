import * as React from 'react';

import { IContextValue as AdminBannersContextValue } from 'src/state/AdminBannersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { useDebounce } from 'src/hooks/useDebounce';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  banners: AdminBannersContextValue['adminBannersState']['banners'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminBannersListPresenter = ({
  View,
  adminBannersState: { isListLoading, banners, getBanners, hasListLoaded },
  intlState: { availableLocales },
}: IProps & AdminBannersContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getBanners();
  }, [getBanners]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      banners={banners}
    />
  );
};
