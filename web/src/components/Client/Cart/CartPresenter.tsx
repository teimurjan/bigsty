import * as React from 'react';

import * as yup from 'yup';

import { useBoolean } from 'src/hooks/useBoolean';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { IProductForCartResponseItem } from 'src/api/ProductAPI';
import { IProductService } from 'src/services/ProductService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';
import { ICartStorage } from 'src/storage/CartStorage';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';
import { getUserPropertySafe } from 'src/helpers/user';

export interface IProps extends UserStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IProductService;
  storage: ICartStorage;
}

export interface IViewProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  products: IProductForCartResponseItem[];
  isLoading: boolean;
  error?: string;
  addMore: (product: IProductForCartResponseItem) => void;
  remove: (product: IProductForCartResponseItem) => void;
  getProductCount: (id: number) => number;
  cartItemsCount: number;
  step: number;
  goToNextStep: () => void;
  validator: schemaValidator.ISchemaValidator;
  initialValues: object;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    name: yup.string().required('common.errors.field.empty'),
    phone: yup.string().required('common.errors.field.empty'),
    address: yup.string().required('common.errors.field.empty'),
  }),
);

export const CartPresenter: React.FC<IProps> = ({ View, service, storage, userState: { user } }) => {
  const { value: isOpen, setPositive: open, setNegative: close, toggle } = useBoolean();

  const [step, setStep] = React.useState(0);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [products, setProducts] = React.useState<{ [key: number]: IProductForCartResponseItem }>({});
  const [productsOrder, setProductsOrder] = React.useState<number[]>([]);
  const forceUpdate = useForceUpdate();

  React.useEffect(() => storage.addChangeListener(() => forceUpdate()), [forceUpdate, storage]);

  React.useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const ids = storage.getItems().map(item => item.id);
        const { entities, result } = await service.getForCart(ids);
        setProducts(entities.products);
        setProductsOrder(result);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addMore = React.useCallback(
    (product: IProductForCartResponseItem) => {
      storage.add(product);
    },
    [storage],
  );

  const remove = React.useCallback(
    (product: IProductForCartResponseItem) => {
      const newCount = storage.remove(product);
      if (newCount === 0) {
        setProductsOrder(productsOrder.filter(id => id !== product.id));
      }
    },
    [productsOrder, storage],
  );

  const goToNextStep = React.useCallback(() => {
    setStep(step + 1);
  }, [step]);

  return (
    <View
      isOpen={isOpen}
      open={open}
      close={close}
      toggle={toggle}
      products={agregateOrderedMapToArray(products, productsOrder)}
      getProductCount={id => {
        const storageItem = storage.getItem(id);
        return storageItem && storageItem.count ? storageItem.count : 0;
      }}
      error={error}
      isLoading={isLoading}
      addMore={addMore}
      remove={remove}
      step={step}
      goToNextStep={goToNextStep}
      validator={validator}
      initialValues={{
        name: getUserPropertySafe(user, 'name'),
      }}
      cartItemsCount={storage.getItems().length}
    />
  );
};
