import * as React from 'react';

import { useDependencies } from 'src/DI/DI';

import { ProductSelectPresenter, IProps as IPresenterProps } from './ProductSelectPresenter';
import { ProductSelectView } from './ProductSelectView';

interface IProps {
  onChange: IPresenterProps['onChange'];
  placeholder?: string;
}

export const ProductSelectContainer = ({ onChange, placeholder }: IProps) => {
  const { dependencies } = useDependencies();

  return (
    <ProductSelectPresenter
      onChange={onChange}
      View={ProductSelectView}
      searchService={dependencies.services.search}
      placeholder={placeholder}
    />
  );
};
