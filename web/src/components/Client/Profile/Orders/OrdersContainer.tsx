import React from 'react';

import { OrdersPresenter } from 'src/components/Client/Profile/Orders/OrdersPresenter';
import { OrdersView } from 'src/components/Client/Profile/Orders/OrdersView';
import { useDependencies } from 'src/DI/DI';
import { useUserState, AuthorizedUser } from 'src/state/UserState';

export const OrdersContainer = () => {
  const {
    dependencies: {
      services: { order: orderService },
    },
  } = useDependencies();

  const {
    userState: { user },
  } = useUserState();

  return user ? <OrdersPresenter View={OrdersView} service={orderService} user={user as AuthorizedUser} /> : null;
};
