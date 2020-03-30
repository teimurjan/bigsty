import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { useDebounce } from 'src/hooks/useDebounce';
import { ISearchService } from 'src/services/SearchService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ISearchService;
}

export interface IViewProps {
  categories: ICategoryListResponseItem[];
  productTypes: IProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
}

export const SearchPresenter = ({ service, View }: IProps) => {
  const [data, setData] = React.useState<{
    categories: { [id: string]: ICategoryListResponseItem };
    productTypes: { [id: string]: IProductTypeListResponseItem };
  }>({ categories: {}, productTypes: {} });
  const [order, setOrder] = React.useState<{ categories: number[]; productTypes: number[] }>({
    categories: [],
    productTypes: [],
  });
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const isLoadingDebounced = useDebounce(isLoading, 1000);

  const onSearchValueChange = React.useCallback(
    async (value: string) => {
      setError(undefined);
      try {
        if (value.length === 0) {
          setData({ categories: {}, productTypes: {} });
          setOrder({ categories: [], productTypes: [] });
        } else {
          const { entities, result } = await service.search(value);
          setData(entities);
          setOrder(result);
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [service],
  );

  return (
    <View
      isLoading={isLoadingDebounced}
      categories={agregateOrderedMapToArray(data.categories, order.categories)}
      productTypes={agregateOrderedMapToArray(data.productTypes, order.productTypes)}
      onSearchValueChange={onSearchValueChange}
      error={error}
    />
  );
};
