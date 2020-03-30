import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { AdminOrdersDeleteContainer } from './Delete/AdminOrdersDeleteContainer';
import { AdminOrdersEditContainer } from './Edit/AdminOrdersEditContainer';
import { AdminOrdersListContainer } from './List/AdminOrdersListContainer';

export const AdminOrders = ({ match }: RouteComponentProps) => (
  <>
    <AdminOrdersListContainer />
    <Route path={`${match.path}/delete/:id`} component={AdminOrdersDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminOrdersEditContainer} />
  </>
);
