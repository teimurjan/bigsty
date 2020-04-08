import * as React from 'react';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { IProps as IListViewProps } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps {
  ListView: React.ComponentClass<IListViewProps> | React.SFC<IListViewProps>;
  productTypeService: IProductTypeService;
  categoryId?: number;
  initialProps?: {
    productTypes: { [key: string]: IProductTypeListResponseItem };
    productTypesMeta: IProductTypeListResponseMeta;
    productTypesOrder: number[];
    error?: string;
  };
}

export const ProductTypesPagePresenter = ({ ListView, categoryId, productTypeService, initialProps }: IProps) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(false);
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListResponseItem }>({});
  const [productTypesMeta, setProductTypesMeta] = React.useState<IProductTypeListResponseMeta>({
    count: 0,
    pages_count: 0,
    limit: 0,
    page: 0,
  });
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);

  // When navigating between categories the initialProps are changing and needed to be set to state
  React.useEffect(() => {
    if (initialProps) {
      setError(initialProps.error);
      setProductTypes(initialProps.productTypes);
      setProductTypesMeta(initialProps.productTypesMeta);
      setProductTypesOrder(initialProps.productTypesOrder);
    }
  }, [initialProps]);

  React.useEffect(() => {
    if (categoryId && !initialProps) {
      (async () => {
        setLoading(true);
        try {
          const { entities, result, meta } = await productTypeService.getForCategory(categoryId, 1);
          setProductTypes(entities.productTypes);
          setProductTypesMeta(meta);
          setProductTypesOrder(result);
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  return (
    <ListView
      productTypes={agregateOrderedMapToArray(productTypes, productTypesOrder)}
      meta={productTypesMeta}
      isLoading={isLoading}
      error={error}
    />
  );
};
