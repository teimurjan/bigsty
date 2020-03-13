import * as React from 'react';

import { IContextValue as AdminOrdersContextValue } from 'src/state/AdminOrdersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  orders: AdminOrdersContextValue['adminOrdersState']['orders'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminOrdersListPresenter = ({
  View,
  adminOrdersState: { isListLoading, orders, getOrders, hasListLoaded },
}: IProps & AdminOrdersContextValue & IntlStateContextValue) => {
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    getOrders();
  }, [getOrders]);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading && isLoadingTimeoutExpired} orders={orders} />;
};
