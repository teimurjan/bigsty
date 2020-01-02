import * as React from 'react';

import { IProductTypeListRawIntlResponseItem } from 'src/api/ProductTypeAPI';

import { useDependencies } from 'src/DI/DI';

import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';

import { useIntlState } from 'src/state/IntlState';

export interface IContextValue {
  adminProductTypesState: {
    productTypes: IProductTypeListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getProductTypes: (page?: number) => Promise<void>;
    deleteProductType: (id: number) => void;
    addProductType: (productType: IProductTypeListRawIntlResponseItem) => void;
    setProductType: (productType: IProductTypeListRawIntlResponseItem) => void;
    recentPage: number;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminProductTypesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { productType: service },
    },
  } = useDependencies();

  const [recentPage, setRecentPage] = React.useState(0);
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListRawIntlResponseItem }>({});
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getProductTypes = React.useCallback(
    async (page = 1) => {
      setListLoading(true);
      try {
        const { entities, result } = await service.getAllRawIntl(page);
        setProductTypes(entities.productTypes);
        setProductTypesOrder(result);
        setRecentPage(page);
      } catch (e) {
        setListError('errors.common');
      } finally {
        setListLoading(false);
        setListLoaded(true);
      }
    },
    [service],
  );

  const addProductType = React.useCallback(
    (productType: IProductTypeListRawIntlResponseItem) => {
      const newProductTypes = {
        ...productTypes,
        [productType.id]: productType,
      };

      const newProductTypesOrder = [...productTypesOrder, productType.id];

      setProductTypes(newProductTypes);
      setProductTypesOrder(newProductTypesOrder);
    },
    [productTypes, productTypesOrder],
  );

  const setProductType = React.useCallback(
    (productType: IProductTypeListRawIntlResponseItem) => {
      const newProductTypes = {
        ...productTypes,
        [productType.id]: productType,
      };

      setProductTypes(newProductTypes);
    },
    [productTypes],
  );

  const deleteProductType = React.useCallback(
    (id: number) => {
      const newProductTypes = { ...productTypes };
      delete newProductTypes[id];

      const newProductTypesOrder = productTypesOrder.filter(idFromOrder => idFromOrder !== id);
      setProductTypes(newProductTypes);
      setProductTypesOrder(newProductTypesOrder);
    },
    [productTypes, productTypesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminProductTypesState: {
          recentPage,
          addProductType,
          deleteProductType,
          productTypes: productTypesOrder.map(productTypeId => {
            const productType: IProductTypeListRawIntlResponseItem = productTypes[productTypeId];

            return {
              ...productType,
              name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
              description: extendIntlTextWithLocaleNames(productType.description, availableLocales),
              short_description: extendIntlTextWithLocaleNames(productType.short_description, availableLocales),
            };
          }),
          getProductTypes,
          hasListLoaded,
          isListLoading,
          listError,
          setProductType,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminProductTypesState = () => React.useContext(Context) as IContextValue;
