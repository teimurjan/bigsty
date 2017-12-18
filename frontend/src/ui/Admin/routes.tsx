import * as React from 'react';
import Route from 'react-router/lib/Route';
import Layout from './Layout/Layout';
import UsersIndex from './Users/Index/UsersIndexContainer';

export default (
  <Route path="admin" component={Layout}>
    <Route path="users" component={UsersIndex}/>
  </Route>
);