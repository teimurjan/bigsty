/** @jsx jsx */
import { jsx } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';
import { fullWidthMixin } from 'src/styles/mixins';

import { AdminTable } from '../../AdminTable';

import { IViewProps as IProps } from './AdminProductsListPresenter';

export const NewProductButton = injectIntl(({ intl }) => (
  <LinkButton to="/admin/products/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
  </LinkButton>
));

const NoProductsAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminProducts.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminProducts.notFound.description',
    })}
    CTA={
      <LinkButton to="/admin/products/new" color="is-primary">
        {intl.formatMessage({ id: 'AdminProducts.notFound.cta' })}
      </LinkButton>
    }
  />
));

const renderNoData = () => <NoProductsAvialable />;

type Product = IProps['products'][0];

export const AdminProductsListView = ({
  products,
  intl,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
}: IProps & { intl: IntlShape }) => (
  <Section css={fullWidthMixin}>
    <AdminTable<Product>
      hideSubheader={true}
      pathPrefix="/admin/products"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={products}
      renderNoData={renderNoData}
      intl={intl}
      currentPage={meta.page}
      pagesCount={meta.pages_count}
      onPageChange={onPageChange}
    >
      <AdminTable.Col<Product> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Product> key_="upc" title={intl.formatMessage({ id: 'common.upc' })} />
      <AdminTable.Col<Product> key_="price" title={intl.formatMessage({ id: 'AdminProducts.price' })} />
      <AdminTable.Col<Product> key_="quantity" title={intl.formatMessage({ id: 'AdminProducts.quantity' })} />
      <AdminTable.Col<Product> key_="discount" title={intl.formatMessage({ id: 'AdminProducts.discount' })} />
      <AdminTable.Col<Product>
        key_="product_type"
        title={intl.formatMessage({ id: 'common.productType' })}
        render={product => product.product_type.name}
      />
    </AdminTable>

    {isDataLoaded && products.length > 0 && <NewProductButton />}
  </Section>
);
