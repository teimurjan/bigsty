import * as React from "react";

import { InjectedIntlProps, injectIntl } from "react-intl";

import { AdminTable, IntlRenderer } from "src/components/Admin/AdminTable";
import { Container } from "src/components/common/Container/Container";
import { LinkButton } from "src/components/common/LinkButton/LinkButton";
import { NoDataAvailable } from "src/components/common/NoDataAvailable/NoDataAvaiable";
import { Section } from "src/components/common/Section/Section";

import { IViewProps as IProps } from "./AdminFeatureTypesListPresenter";

const NoFeatureTypesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: "AdminFeatureTypes.notFound.title" })}
    description={intl.formatMessage({
      id: "AdminFeatureTypes.notFound.description"
    })}
    CTA={
      <LinkButton to="/admin/featureTypes/new" color="is-primary">
        {intl.formatMessage({ id: "AdminFeatureTypes.notFound.cta" })}
      </LinkButton>
    }
  />
));

const renderNoData = () => <NoFeatureTypesAvialable />;

type Category = IProps["featureTypes"][0];

export const AdminFeatureTypesListView = ({
  featureTypes,
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
        entities={featureTypes}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<Category>
          key_="id"
          title={intl.formatMessage({ id: "common.ID" })}
        />
        <AdminTable.Col<Category>
          key_="name"
          title={intl.formatMessage({ id: "AdminFeatureTypes.names" })}
          renderer={new IntlRenderer(locales)}
        />
      </AdminTable>
    </Container>
  </Section>
);
