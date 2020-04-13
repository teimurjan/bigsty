/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { IntlShape, injectIntl } from 'react-intl';

import { AdminTable } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Orders/List/AdminOrdersListPresenter';
import { NoDataAvailable } from 'src/components/common/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/common/Section/Section';

const NoOrdersAvialable = injectIntl(({ intl }) => (
  <NoDataAvailable title={intl.formatMessage({ id: 'AdminOrders.notFound.title' })} />
));

const renderNoData = () => <NoOrdersAvialable />;

type Order = IProps['orders'][0];

export const AdminOrdersListView = ({ orders, intl, isLoading, isDataLoaded }: IProps & { intl: IntlShape }) => (
  <Section
    css={css`
      width: 100%;
    `}
  >
    <AdminTable<Order>
      hideSubheader={true}
      pathPrefix="/admin/orders"
      isLoading={isLoading}
      isDataLoaded={isDataLoaded}
      entities={orders}
      renderNoData={renderNoData}
      intl={intl}
    >
      <AdminTable.Col<Order> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
      <AdminTable.Col<Order> key_="user_name" title={intl.formatMessage({ id: 'AdminOrders.userName' })} />
      <AdminTable.Col<Order>
        key_="user_phone_number"
        title={intl.formatMessage({ id: 'AdminOrders.userPhoneNumber' })}
      />
      <AdminTable.Col<Order> key_="user_address" title={intl.formatMessage({ id: 'AdminOrders.userAddress' })} />
      <AdminTable.Col<Order> key_="status" title={intl.formatMessage({ id: 'AdminOrders.status' })} />
      <AdminTable.Col<Order> key_="created_on" title={intl.formatMessage({ id: 'AdminOrders.createdOn' })} />
    </AdminTable>
  </Section>
);
