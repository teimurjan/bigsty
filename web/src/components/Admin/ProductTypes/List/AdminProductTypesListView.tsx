/** @jsx jsx */
import { jsx } from '@emotion/core';

import { IntlShape, injectIntl } from 'react-intl';

import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';

import { AdminTable, IntlRenderer, ImageRenderer } from '../../AdminTable';

import { IViewProps as IProps } from './AdminProductTypesListPresenter';
import { fullWidthMixin } from 'src/styles/mixins';

export const NewProductTypeButton = injectIntl(({ intl }) => (
  <LinkButton to="/admin/productTypes/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminProductTypes.notFound.cta' })}
  </LinkButton>
));

const NoProductTypesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminProductTypes.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminProductTypes.notFound.description',
    })}
    CTA={
      <LinkButton to="/admin/productTypes/new" color="is-primary">
        {intl.formatMessage({ id: 'AdminProductTypes.notFound.cta' })}
      </LinkButton>
    }
  />
));

const renderNoData = () => <NoProductTypesAvialable />;

type ProductType = IProps['productTypes'][0];

export const AdminProductTypesListView = ({
  productTypes,
  locales,
  intl,
  isLoading,
  isDataLoaded,
  meta,
  onPageChange,
}: IProps & { intl: IntlShape }) => (
  <Section css={fullWidthMixin}>
    <AdminTable<ProductType>
      pathPrefix="/admin/productTypes"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={productTypes}
      renderNoData={renderNoData}
      intl={intl}
      currentPage={meta.page}
      pagesCount={meta.pages_count}
      onPageChange={onPageChange}
    >
      <AdminTable.Col<ProductType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<ProductType>
        key_="name"
        title={intl.formatMessage({ id: 'AdminProductTypes.names' })}
        renderer={new IntlRenderer(locales)}
      />
      <AdminTable.Col<ProductType>
        key_="image"
        title={intl.formatMessage({ id: 'AdminProductTypes.image' })}
        renderer={new ImageRenderer(productType => productType.name[intl.locale])}
      />
    </AdminTable>

    {isDataLoaded && productTypes.length > 0 && <NewProductTypeButton />}
  </Section>
);
