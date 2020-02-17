import * as React from 'react';

import classNames from 'classnames';
import { IntlShape, injectIntl } from 'react-intl';

import { Column } from 'src/components/common/Column/Column';
import { Columns } from 'src/components/common/Columns/Columns';
import { ErrorLayout } from 'src/components/common/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/common/LoaderLayout/LoaderLayout';
import { UncontrolledPagination } from 'src/components/common/UncontrolledPagination/UncontrolledPagination';
import { ProductTypeCard } from 'src/components/Client/ProductType/ProductTypeCard/ProductTypeCard';
import { IListViewProps as IProps } from 'src/components/Client/ProducTypesPage/ProductTypesPagePresenter';

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
          <Columns className="is-mobile">
            {productTypes.map(productType => (
              <Column key={productType.id} className={classNames('is-one-quarter-desktop', 'is-half-mobile')}>
                <ProductTypeCard productType={productType} />
              </Column>
            ))}
          </Columns>
          {meta.pages_count > 1 && <UncontrolledPagination length={meta.pages_count} />}
        </React.Fragment>
      );
    };
  },
);
