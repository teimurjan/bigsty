import * as React from 'react';

import { IntlShape, injectIntl } from 'react-intl';

import { Container } from 'src/components/common/Container/Container';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';

import { AdminTable, IntlRenderer } from '../../AdminTable';
import { IViewProps as IProps } from './AdminCategoriesListPresenter';

const NewCategoryButton = injectIntl(({ intl }) => (
  <LinkButton to="/admin/categories/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
  </LinkButton>
));

const NoCategoriesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminCategories.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminCategories.notFound.description',
    })}
    CTA={
      <LinkButton to="/admin/categories/new" color="is-primary">
        {intl.formatMessage({ id: 'AdminCategories.notFound.cta' })}
      </LinkButton>
    }
  />
));

const renderNoData = () => <NoCategoriesAvialable />;

type Category = IProps['categories'][0];

export const AdminCategoriesListView = ({
  categories,
  locales,
  intl,
  isLoading,
  isDataLoaded,
}: IProps & { intl: IntlShape }) => (
  <Section>
    <Container>
      <AdminTable<Category>
        pathPrefix="/admin/categories"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={categories}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<Category> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<Category>
          key_="parent_category_id"
          title={intl.formatMessage({
            id: 'AdminCategories.parentCategoryID',
          })}
        />
        <AdminTable.Col<Category>
          key_="name"
          title={intl.formatMessage({ id: 'AdminCategories.names' })}
          renderer={new IntlRenderer(locales)}
        />
      </AdminTable>

      {isDataLoaded && categories.length > 0 && <NewCategoryButton />}
    </Container>
  </Section>
);
