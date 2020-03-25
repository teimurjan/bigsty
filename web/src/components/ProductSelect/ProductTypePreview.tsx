import * as React from 'react';

import { useIntl } from 'react-intl';

import { useDependencies } from 'src/DI/DI';

import {
  ProductTypePagePresenter,
  IProps as IPresenterProps,
} from '../Client/ProductTypePage/ProductTypePagePresenter';
import { ProductTypePageView } from '../Client/ProductTypePage/ProductTypePageView';

export interface IProps {
  id: number;
  action: IPresenterProps['action'];
}

export const ProductTypePreview = ({ id, action }: IProps) => {
  const { dependencies } = useDependencies();

  const intl = useIntl();

  return (
    <ProductTypePagePresenter
      action={action}
      actionText={intl.formatMessage({ id: 'common.choose' })}
      id={id}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      View={ProductTypePageView}
    />
  );
};
