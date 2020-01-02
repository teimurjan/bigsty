import * as React from 'react';

import { Route, RouteComponentProps } from 'react-router';

import { AdminProductTypesListContainer } from './List/AdminProductTypesListContainer';
import { AdminProductTypesCreateContainer } from './Create/AdminProductTypesCreateContainer';
import { AdminProductTypesEditContainer } from './Edit/AdminProductTypesEditContainer';

export const AdminProductTypes = ({ match }: RouteComponentProps) => (
  <>
    <AdminProductTypesListContainer />

    <Route path={`${match.path}/new`} component={AdminProductTypesCreateContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminProductTypesEditContainer} />
  </>
);
