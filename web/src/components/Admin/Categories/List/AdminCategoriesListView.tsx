import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { Container } from "src/components/common/Container/Container";
import { LinkButton } from "src/components/common/LinkButton/LinkButton";
import { NoDataAvailable } from "src/components/common/NoDataAvailable/NoDataAvaiable";
import { Section } from "src/components/common/Section/Section";

import { AdminTable, IntlRenderer } from "../../AdminTable";
import { IViewProps as IProps } from "./AdminCategoriesListPresenter";

const NoCategoriesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: "AdminCategories.notFound.title" })}
    description={intl.formatMessage({
      id: "AdminCategories.notFound.description"
    })}
    CTA={
      <LinkButton to="/admin/categories/new" color="is-primary">
        {intl.formatMessage({ id: "AdminCategories.notFound.cta" })}
      </LinkButton>
    }
  />
));

const renderNoData = () => <NoCategoriesAvialable />;

type Category = IProps["categories"][0];

export const AdminCategoriesListView = ({
  categories,
  locales,
  intl,
  openDeletion,
  isLoading,
  isDataLoaded
}: IProps & InjectedIntlProps) => (
  <Section>
    <Container>
      <AdminTable<Category>
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        onDelete={openDeletion}
        entities={categories}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<Category>
          key_="id"
          title={intl.formatMessage({ id: "common.ID" })}
        />
        <AdminTable.Col<Category>
          key_="parent_category_id"
          title={intl.formatMessage({
            id: "AdminCategories.parentCategoryID"
          })}
        />
        <AdminTable.Col<Category>
          key_="name"
          title={intl.formatMessage({ id: "AdminCategories.names" })}
          renderer={new IntlRenderer(locales)}
        />
      </AdminTable>
    </Container>
  </Section>
);
