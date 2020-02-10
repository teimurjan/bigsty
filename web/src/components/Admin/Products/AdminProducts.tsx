import * as React from 'react';

import { Route, RouteComponentProps } from 'react-router';

import { AdminProductsListContainer } from './List/AdminProductsListContainer';
import { AdminProductsCreateContainer } from './Create/AdminProductsCreateContainer';
import { AdminProductsEditContainer } from './Edit/AdminProductsEditContainer';
import { AdminProductsDeleteContainer } from './Delete/AdminProductsDeleteContainer';

export const AdminProducts = ({ match }: RouteComponentProps) => (
  <>
    <AdminProductsListContainer />
    <Route path={`${match.path}/new`} component={AdminProductsCreateContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminProductsEditContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminProductsDeleteContainer} />
  </>
);
