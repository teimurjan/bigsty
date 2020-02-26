import * as React from 'react';

import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';

import { AdminBannersListContainer } from './List/AdminBannersListContainer';
import { AdminBannersCreateContainer } from './Create/AdminBannersCreateContainer';
import { AdminBannersDeleteContainer } from './Delete/AdminBannersDeleteContainer';
import { AdminBannersEditContainer } from './Edit/AdminBannersEditContainer';

export const AdminBanners = ({ match }: RouteComponentProps) => (
  <>
    <AdminBannersListContainer />

    <Route path={`${match.path}/new`} component={AdminBannersCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminBannersDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminBannersEditContainer} />
  </>
);
