import * as React from 'react';

import { IntlShape, injectIntl } from 'react-intl';

import { AdminTable, IntlRenderer } from 'src/components/Admin/AdminTable';
import { Container } from 'src/components/common/Container/Container';
import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';

import { IViewProps as IProps } from './AdminFeatureTypesListPresenter';

const NewFeatureTypeButton = injectIntl(({ intl }) => (
  <LinkButton to="/admin/featureTypes/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminFeatureTypes.notFound.cta' })}
  </LinkButton>
));

const NoFeatureTypesAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminFeatureTypes.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminFeatureTypes.notFound.description',
    })}
    CTA={<NewFeatureTypeButton />}
  />
));

const renderNoData = () => <NoFeatureTypesAvialable />;

type FeatureType = IProps['featureTypes'][0];

export const AdminFeatureTypesListView = ({
  featureTypes,
  locales,
  intl,
  isLoading,
  isDataLoaded,
}: IProps & { intl: IntlShape }) => (
  <Section>
    <Container>
      <AdminTable<FeatureType>
        pathPrefix="/admin/featureTypes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={featureTypes}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<FeatureType> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<FeatureType>
          key_="name"
          title={intl.formatMessage({ id: 'AdminFeatureTypes.names' })}
          renderer={new IntlRenderer(locales)}
        />
      </AdminTable>

      {isDataLoaded && featureTypes.length > 0 && <NewFeatureTypeButton />}
    </Container>
  </Section>
);
