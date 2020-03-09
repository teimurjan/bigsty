import * as React from 'react';

import { IProductTypeDetailResponseItem } from 'src/api/ProductTypeAPI';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { IProductService } from 'src/services/ProductService';
import { IProductForProductTypeResponseItem } from 'src/api/ProductAPI';
import { ICartStorage } from 'src/storage/CartStorage';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  productTypeService: IProductTypeService;
  productService: IProductService;
  cartStorage: ICartStorage;
  id: number;
}

export interface IViewProps {
  productType?: IProductTypeDetailResponseItem;
  products: IProductForProductTypeResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  addProductToCart: (product: IProductForProductTypeResponseItem) => void;
}

export const ProductTypePagePresenter: React.FC<IProps> = ({
  View,
  productService,
  productTypeService,
  id,
  cartStorage,
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

  const addProductToCart = React.useCallback(
    (product: IProductForProductTypeResponseItem) => {
      cartStorage.add(product);
    },
    [cartStorage],
  );

  return (
    <View
      addProductToCart={addProductToCart}
      isLoading={isLoading}
      productType={productType}
      products={products}
      error={error}
    />
  );
};
