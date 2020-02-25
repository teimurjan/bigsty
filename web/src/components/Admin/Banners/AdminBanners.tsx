import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';

import { AdminBannersListContainer } from './List/AdminBannersListContainer';
import { AdminBannersCreateContainer } from './Create/AdminBannersCreateContainer';

export const AdminBanners = ({ match }: RouteComponentProps) => (
  <>
    <AdminBannersListContainer />

    <Route path={`${match.path}/new`} component={AdminBannersCreateContainer} />
    {/* <Route path={`${match.path}/delete/:id`} component={AdminCategoriesDeleteContainer} /> */}
    {/* <Route path={`${match.path}/edit/:id`} component={AdminCategoriesEditContainer} /> */}
  </>
);
