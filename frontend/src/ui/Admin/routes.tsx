import * as React from 'react';
import Route from 'react-router/lib/Route';
import Layout from './Layout/Layout';
import Users from './Users/Index/UsersContainer';

export default (
  <Route path="admin" component={Layout}>
    <Route path="users" component={Users}/>
  </Route>
);