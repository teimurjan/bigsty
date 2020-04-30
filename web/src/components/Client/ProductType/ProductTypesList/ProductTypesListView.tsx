/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { ProductTypeCard } from 'src/components/Client/ProductType/ProductTypeCard/ProductTypeCard';
import { Pagination } from 'src/components/common-v2/Pagination/Pagination';
import { Column } from 'src/components/common/Column/Column';
import { Columns } from 'src/components/common/Columns/Columns';
import { Container } from 'src/components/common/Container/Container';
import { ErrorLayout } from 'src/components/common/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { mediaQueries } from 'src/styles/media';

export interface IProps {
  productTypes: IProductTypeListResponseItem[];
  meta?: IProductTypeListResponseMeta;
  error?: string;
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  filter?: React.ReactNode;
}

export const ProductTypesListView = ({ filter, isLoading, error, productTypes, meta, onPageChange }: IProps) => {
  const intl = useIntl();

  if (error) {
    return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
  }

  return (
    <Container>
      <div
        css={css`
          display: flex;

          @media ${mediaQueries.maxWidth768} {
            flex-direction: column;
          }
        `}
      >
        {filter}

        <>
          <Columns
            css={css`
              width: 100%;
              flex-wrap: wrap;
              border-radius: 40px;
              margin-top: 10px !important;
            `}
            className="is-mobile"
          >
            {productTypes.map(productType => (
              <Column
                key={productType.id}
                className={
                  filter
                    ? classNames('is-half-mobile', 'is-one-third-desktop', 'is-one-quarter-widescreen')
                    : classNames('is-half-mobile', 'is-one-quarter-desktop', 'is-one-fifths-widescreen')
                }
              >
                <ProductTypeCard productType={productType} />
              </Column>
            ))}
          </Columns>
          {meta && meta.pages_count > 1 && (
            <Pagination length={meta.pages_count} page={meta.page} onChange={onPageChange} />
          )}
        </>
      </div>
    </Container>
  );
};
