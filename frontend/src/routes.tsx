import * as React from 'react';
import { Route } from 'react-router';
import App from './ui/App/App';
import Login from './ui/Login/LoginContainer';
import Registration from './ui/Registration/RegistrationContainer';
import adminRoutes from './ui/Admin/routes';

export default (
  <Route path="/" component={App}>
    <Route path="login" component={Login}/>
    <Route path="register" component={Registration}/>
    {adminRoutes}
  </Route>
);