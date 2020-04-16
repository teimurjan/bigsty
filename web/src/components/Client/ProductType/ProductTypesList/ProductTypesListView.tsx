/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { ProductTypeCard } from 'src/components/Client/ProductType/ProductTypeCard/ProductTypeCard';
import { Column } from 'src/components/common/Column/Column';
import { Columns } from 'src/components/common/Columns/Columns';
import { Container } from 'src/components/common/Container/Container';
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
    <Container>
      <Columns
        css={css`
          flex-wrap: wrap;
          border-radius: 40px;
          margin-top: 10px !important;
        `}
        className="is-mobile"
      >
        {productTypes.map(productType => (
          <Column
            key={productType.id}
            className={classNames('is-half-mobile', 'is-one-quarter-desktop', 'is-one-fifths-widescreen')}
          >
            <ProductTypeCard productType={productType} />
          </Column>
        ))}
      </Columns>
      {meta && meta.pages_count > 1 && <UncontrolledPagination length={meta.pages_count} />}
    </Container>
  );
};
