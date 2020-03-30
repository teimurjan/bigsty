import * as React from 'react';

import { IBannerListResponseItem } from 'src/api/BannerAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { IBannerService } from 'src/services/BannerService';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps extends AppStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  bannerService: IBannerService;
  productTypeService: IProductTypeService;
}

export interface IViewProps {
  banners: IBannerListResponseItem[];
  productTypes: IProductTypeListResponseItem[];
  error?: string;
}

export const HomePresenter: React.FC<IProps> = ({ View, bannerService, productTypeService, appState }) => {
  const [banners, setBanners] = React.useState<{ [key: string]: IBannerListResponseItem }>({});
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListResponseItem }>({});
  const [bannersOrder, setBannersOrder] = React.useState<number[]>([]);
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);
  const [error, setError] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    (async () => {
      try {
        appState.setLoading();
        const {
          entities: { banners: _banners },
          result: _bannersOrder,
        } = await bannerService.getAll();
        setBanners(_banners);
        setBannersOrder(_bannersOrder);
        const {
          entities: { productTypes: _productTypes },
          result: _productTypesOrder,
        } = await productTypeService.getNewest();
        setProductTypes(_productTypes);
        setProductTypesOrder(_productTypesOrder);
      } catch (e) {
        setError('errors.common');
      } finally {
        appState.setIdle();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      banners={agregateOrderedMapToArray(banners, bannersOrder)}
      productTypes={agregateOrderedMapToArray(productTypes, productTypesOrder)}
      error={error}
    />
  );
};
