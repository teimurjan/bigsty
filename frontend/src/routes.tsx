import * as React from 'react';
import {Route} from 'react-router';
import App from './ui/App/App';
import Login from './ui/Login/LoginContainer';
import Registration from './ui/Registration/RegistrationContainer';

export default (
  <Route path="/" component={App}>
    <Route path="login" component={Login}/>
    <Route path="register" component={Registration}/>
  </Route>
)