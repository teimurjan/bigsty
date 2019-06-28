import * as React from "react";

import classNames from "classnames";
import { InjectedIntlProps, injectIntl } from "react-intl";

import { Column } from "src/components/common/Column/Column";
import { Columns } from "src/components/common/Columns/Columns";
import { Container } from "src/components/common/Container/Container";
import { ErrorLayout } from "src/components/common/ErrorLayout/ErrorLayout";
import { LoaderLayout } from "src/components/common/LoaderLayout/LoaderLayout";
import { Section } from "src/components/common/Section/Section";
import { UncontrolledPagination } from "src/components/common/UncontrolledPagination/UncontrolledPagination";
import { ProductTypeCard } from "src/components/ProductType/ProductTypeCard/ProductTypeCard";
import { IListViewProps as IProps } from "src/components/ProductType/ProducTypesPage/ProductTypesPagePresenter";

export const ProductTypesListView = injectIntl(
  class extends React.Component<IProps & InjectedIntlProps> {
    public render() {
      return (
        <Section>
          <Container>{this.renderEntity()}</Container>
        </Section>
      );
    }

    private renderEntity = () => {
      const { isLoading, error, intl } = this.props;
      if (isLoading) {
        return <LoaderLayout />;
      }

      if (error) {
        return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
      }

      return this.renderColumns();
    };

    private renderColumns = () => {
      const { productTypes, meta } = this.props;
      return (
        <React.Fragment>
          <Columns>
            {productTypes.map(productType => (
              <Column
                key={productType.id}
                className={classNames(
                  "is-one-quarter-desktop",
                  "is-full-mobile"
                )}
              >
                <ProductTypeCard productType={productType} />
              </Column>
            ))}
          </Columns>
          <UncontrolledPagination length={meta.count} />
        </React.Fragment>
      );
    };
  }
);
