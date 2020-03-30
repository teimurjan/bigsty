/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

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

export const ProductTypesListView = injectIntl(
  class extends React.Component<IProps & { intl: IntlShape }> {
    public render() {
      const { isLoading, error, intl } = this.props;
      if (isLoading) {
        return <LoaderLayout />;
      }

      if (error) {
        return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
      }

      return this.renderColumns();
    }

    private renderColumns = () => {
      const { productTypes, meta } = this.props;
      return (
        <React.Fragment>
          <Columns
            css={css`
              flex-wrap: wrap;
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
  },
);
