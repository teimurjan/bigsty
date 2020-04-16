import * as React from 'react';

import { ProductSelectPresenter, IProps as IPresenterProps } from 'src/components/ProductSelect/ProductSelectPresenter';
import { ProductSelectView } from 'src/components/ProductSelect/ProductSelectView';
import { useDependencies } from 'src/DI/DI';

interface IProps {
  onChange: IPresenterProps['onChange'];
  placeholder?: string;
  className?: string;
}

export const ProductSelectContainer = ({ onChange, placeholder, className }: IProps) => {
  const { dependencies } = useDependencies();

  return (
    <ProductSelectPresenter
      className={className}
      onChange={onChange}
      View={ProductSelectView}
      searchService={dependencies.services.search}
      placeholder={placeholder}
    />
  );
};
