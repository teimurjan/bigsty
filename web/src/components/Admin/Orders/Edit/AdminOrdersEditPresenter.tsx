import * as React from 'react';

import { History } from 'history';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';

import { IOrderService } from 'src/services/OrderService';

import { IContextValue as AdminOrdersStateContextValue } from 'src/state/AdminOrdersState';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { IOrderListResponseItem } from 'src/api/OrderAPI';

export interface IProps extends AdminOrdersStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IOrderService;
  history: History;
  orderId: number;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: {
    user_name: string;
    user_phone_number: string;
    user_address: string;
    items: Array<{
      id: number;
      product: { id: number };
      quantity: number;
    }>;
    status: string;
  }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    user_name: yup.string().required('common.errors.field.empty'),
    user_phone_number: yup.string().required('common.errors.field.empty'),
    user_address: yup.string().required('common.errors.field.empty'),
    status: yup.string().required('common.errors.field.empty'),
    items: yup.array().min(1, 'common.errors.field.atLeast1'),
  }),
);

export const AdminOrdersEditPresenter: React.FC<IProps> = ({
  history,
  adminOrdersState: { getOrders },
  service,
  View,
  orderId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [order, setOrder] = React.useState<IOrderListResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isTimeoutExpired = useTimeoutExpired(1000);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setOrder(await service.getOne(orderId));
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, service]);

  const close = React.useCallback(() => history.push('/admin/orders'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async values => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        items: values.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      try {
        await service.edit(orderId, formattedValues);
        getOrders();
        close();
      } catch (e) {
        setError('errors.common');
      } finally {
        setUpdating(false);
      }
    },
    [service, orderId, getOrders, close],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isLoading={isTimeoutExpired && isLoading}
      isUpdating={isUpdating}
      close={close}
      validate={validator.validate}
      preloadingError={preloadingError}
      initialValues={
        order
          ? {
              user_name: order.user_name,
              user_phone_number: order.user_phone_number,
              user_address: order.user_address,
              status: order.status,
              items: order.items,
            }
          : {}
      }
    />
  );
};
