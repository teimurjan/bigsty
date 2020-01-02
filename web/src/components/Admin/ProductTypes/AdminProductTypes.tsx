import * as React from 'react';

import { Route, RouteComponentProps } from 'react-router';

import { AdminProductTypesListContainer } from './List/AdminProductTypesListContainer';
import { AdminProductTypesCreateContainer } from './Create/AdminProductTypesCreateContainer';

export const AdminProductTypes = ({ match }: RouteComponentProps) => (
  <>
    <AdminProductTypesListContainer />

    <Route path={`${match.path}/new`} component={AdminProductTypesCreateContainer} />
  </>
);
