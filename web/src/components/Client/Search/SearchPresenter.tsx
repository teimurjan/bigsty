import * as React from 'react';

import { useTimeoutExpired } from 'src/hooks/useTimeoutExpired';
import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { ISearchService } from 'src/services/SearchService';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
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
  const isLoadingTimeoutExpired = useTimeoutExpired(1000);
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
      isLoading={isLoading && isLoadingTimeoutExpired}
      categories={agregateOrderedMapToArray(data.categories, order.categories)}
      productTypes={agregateOrderedMapToArray(data.productTypes, order.productTypes)}
      onSearchValueChange={onSearchValueChange}
      error={error}
    />
  );
};
