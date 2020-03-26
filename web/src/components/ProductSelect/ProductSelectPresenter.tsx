import * as React from 'react';

import { ISearchService } from 'src/services/SearchService';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';
import { IProductForProductTypeResponseItem } from 'src/api/ProductAPI';
import { useDebounce } from 'src/hooks/useDebounce';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  searchService: ISearchService;
  onChange: (product: IProductForProductTypeResponseItem) => void;
  placeholder?: string;
}

export interface IViewProps {
  productTypes: IProductTypeListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  onSearchValueChange: (value: string) => Promise<void>;
  selectProductType: (productType?: IProductTypeListResponseItem) => void;
  selectedProductType?: IProductTypeListResponseItem;
  onChange: IProps['onChange'];
  placeholder?: string;
}

export const ProductSelectPresenter = ({ searchService, onChange, View, placeholder }: IProps) => {
  const [productTypes, setProductTypes] = React.useState<{ [id: string]: IProductTypeListResponseItem }>({});
  const [selectedProductType, setSelectedProductType] = React.useState<IProductTypeListResponseItem | undefined>(
    undefined,
  );
  const [order, setOrder] = React.useState<number[]>([]);
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const isLoadingDebounced = useDebounce(isLoading, 1000);

  const onSearchValueChange = React.useCallback(
    async (value: string) => {
      try {
        setError(undefined);
        if (value.length === 0) {
          setProductTypes({});
          setOrder([]);
        } else {
          const { entities, result } = await searchService.search(value);
          setProductTypes(entities.productTypes);
          setOrder(result.productTypes);
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [searchService],
  );

  const selectProductType: IViewProps['selectProductType'] = React.useCallback(async productType => {
    setSelectedProductType(productType);
  }, []);

  return (
    <View
      isLoading={isLoadingDebounced}
      productTypes={agregateOrderedMapToArray(productTypes, order)}
      onSearchValueChange={onSearchValueChange}
      error={error}
      selectProductType={selectProductType}
      selectedProductType={selectedProductType}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};
