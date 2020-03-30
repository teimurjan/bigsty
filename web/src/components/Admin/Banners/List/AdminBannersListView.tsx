/** @jsx jsx */
import { jsx } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { LinkButton } from 'src/components/common/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';
import { fullWidthMixin } from 'src/styles/mixins';

import { AdminTable, IntlRenderer } from '../../AdminTable';

import { IViewProps as IProps } from './AdminBannersListPresenter';

export const NewBannerButton = injectIntl(({ intl }) => (
  <LinkButton to="/admin/banners/new" color="is-primary">
    {intl.formatMessage({ id: 'AdminBanners.notFound.cta' })}
  </LinkButton>
));

const NoBannersAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable
    title={intl.formatMessage({ id: 'AdminBanners.notFound.title' })}
    description={intl.formatMessage({
      id: 'AdminBanners.notFound.description',
    })}
    CTA={<NewBannerButton />}
  />
));

const renderNoData = () => <NoBannersAvialable />;

type Banner = IProps['banners'][0];

export const AdminBannersListView = ({
  banners,
  locales,
  intl,
  isLoading,
  isDataLoaded,
}: IProps & { intl: IntlShape }) => (
  <Section css={fullWidthMixin}>
    <AdminTable<Banner>
      pathPrefix="/admin/banners"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={banners}
      renderNoData={renderNoData}
      intl={intl}
    >
      <AdminTable.Col<Banner> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Banner>
        key_="link"
        title={intl.formatMessage({
          id: 'AdminBanners.link',
        })}
      />
      <AdminTable.Col<Banner>
        key_="text"
        title={intl.formatMessage({ id: 'AdminBanners.texts' })}
        renderer={new IntlRenderer(locales)}
      />
    </AdminTable>

    {isDataLoaded && banners.length > 0 && <NewBannerButton />}
  </Section>
);
