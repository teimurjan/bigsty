import * as React from 'react';

import { IProductForProductTypeResponseItem } from 'src/api/ProductAPI';
import { IProductTypeDetailResponseItem } from 'src/api/ProductTypeAPI';
import { IProductService } from 'src/services/ProductService';
import { IProductTypeService } from 'src/services/ProductTypeService';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  productTypeService: IProductTypeService;
  productService: IProductService;
  id: number;
  actionText: string;
  action?: (product: IProductForProductTypeResponseItem) => void;
}

export interface IViewProps {
  productType?: IProductTypeDetailResponseItem;
  products: IProductForProductTypeResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  action: IProps['action'];
  actionText: IProps['actionText'];
}

export const ProductTypePagePresenter: React.FC<IProps> = ({
  View,
  productService,
  productTypeService,
  id,
  action,
  actionText,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [productType, setProductType] = React.useState<undefined | IProductTypeDetailResponseItem>(undefined);
  const [products, setProducts] = React.useState<IProductForProductTypeResponseItem[]>([]);

  React.useEffect(() => {
    (async () => {
      try {
        const productType = await productTypeService.getByID(id);
        if (productType) {
          const products = await productService.getForProductType(productType.id);
          setProductType(productType);
          setProducts(products);
        } else {
          setError('ProductPage.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    })();
  }, [id, productService, productTypeService]);

  return (
    <View
      actionText={actionText}
      action={action}
      isLoading={isLoading}
      productType={productType}
      products={products}
      error={error}
    />
  );
};
