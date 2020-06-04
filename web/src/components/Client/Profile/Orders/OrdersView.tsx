/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { ErrorLayout } from 'src/components/client-ui/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { Subtitle } from 'src/components/client-ui/Subtitle/Subtitle';
import { Title } from 'src/components/client-ui/Title/Title';
import { OrderItem } from 'src/components/Client/Profile/Orders/OrderItem/OrderItem';
import { IViewProps as IProps } from 'src/components/Client/Profile/Orders/OrdersPresenter';

export const OrdersView: React.FC<IProps> = ({ isLoading, orders, error }) => {
  const intl = useIntl();

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (error) {
    return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
  }

  return (
    <Container>
      <Title
        css={css`
          margin-top: 20px;
        `}
        size={3}
      >
        {intl.formatMessage({ id: 'Header.orders' })}
      </Title>
      {orders.length === 0 && <Subtitle size={4}>{intl.formatMessage({ id: 'Orders.empty' })}</Subtitle>}

      {orders.map(order => (
        <OrderItem
          key={order.id}
          css={css`
            margin-bottom: 10px;
          `}
          order={order}
        />
      ))}
    </Container>
  );
};
