import React from 'react';

import { IOrderListResponseItem } from 'src/api/OrderAPI';
import { useDebounce } from 'src/hooks/useDebounce';
import { IOrderService } from 'src/services/OrderService';
import { AuthorizedUser } from 'src/state/UserState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IViewProps {
  orders: IOrderListResponseItem[];
  isLoading?: boolean;
  error?: string;
}

interface IProps {
  service: IOrderService;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  user: AuthorizedUser;
}

export const OrdersPresenter: React.FC<IProps> = ({ service, View, user }) => {
  const [isLoading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<{ [key: string]: IOrderListResponseItem }>({});
  const [ordersOrder, setOrdersOrder] = React.useState<number[]>([]);
  const [error, setError] = React.useState<undefined | string>(undefined);
  const isLoadingDebounced = useDebounce(isLoading, 500);

  React.useEffect(() => {
    if (user) {
      (async () => {
        try {
          setLoading(true);
          const {
            entities: { orders },
            result,
          } = await service.getForUser(user.user_id);
          setOrders(orders);
          setOrdersOrder(result);
        } catch (e) {
          setError('error.common');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!user]);

  return <View orders={agregateOrderedMapToArray(orders, ordersOrder)} isLoading={isLoadingDebounced} error={error} />;
};
