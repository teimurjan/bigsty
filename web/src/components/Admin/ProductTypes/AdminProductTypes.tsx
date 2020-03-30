import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminProductTypesCreateContainer } from './Create/AdminProductTypesCreateContainer';
import { AdminProductTypesDeleteContainer } from './Delete/AdminProductTypesDeleteContainer';
import { AdminProductTypesEditContainer } from './Edit/AdminProductTypesEditContainer';
import { AdminProductTypesListContainer } from './List/AdminProductTypesListContainer';

export const AdminProductTypes = ({ match }: RouteComponentProps) => (
  <>
    <AdminProductTypesListContainer />

    <Route path={`${match.path}/new`} component={AdminProductTypesCreateContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminProductTypesEditContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminProductTypesDeleteContainer} />
  </>
);
