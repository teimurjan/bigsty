import * as React from 'react';

import { CartPresenter } from './CartPresenter';
import { CartView } from './CartView';
import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';

export const CartContainer = () => {
  const {
    dependencies: {
      storages: { cart: cartStorage },
      services: { product: productService, order: orderService },
    },
  } = useDependencies();
  const { userState } = useUserState();

  return (
    <CartPresenter
      userState={userState}
      storage={cartStorage}
      productService={productService}
      orderService={orderService}
      View={CartView}
    />
  );
};
