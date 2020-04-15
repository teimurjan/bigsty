/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { ProductTypeCard } from 'src/components/Client/ProductType/ProductTypeCard/ProductTypeCard';
import { Column } from 'src/components/common/Column/Column';
import { Columns } from 'src/components/common/Columns/Columns';
import { ErrorLayout } from 'src/components/common/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { UncontrolledPagination } from 'src/components/common/UncontrolledPagination/UncontrolledPagination';

export interface IProps {
  productTypes: IProductTypeListResponseItem[];
  meta?: IProductTypeListResponseMeta;
  error?: string;
  isLoading: boolean;
}

export const ProductTypesListView = ({ isLoading, error, productTypes, meta }: IProps) => {
  const intl = useIntl();

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (error) {
    return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
  }

  return (
    <React.Fragment>
      <Columns
        css={css`
          flex-wrap: wrap;
          border-radius: 40px;
        `}
        className="is-mobile"
      >
        {productTypes.map(productType => (
          <Column
            key={productType.id}
            className={classNames('is-half-mobile', 'is-one-third-desktop', 'is-one-quarter-widescreen')}
          >
            <ProductTypeCard productType={productType} />
          </Column>
        ))}
      </Columns>
      {meta && meta.pages_count > 1 && <UncontrolledPagination length={meta.pages_count} />}
    </React.Fragment>
  );
};
