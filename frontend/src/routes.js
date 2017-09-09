import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './containers/App';
import Layout from "./containers/Layout";
import Index from "./components/Index";
import ProductGrid from "./containers/ProductGrid";
import Registration from "./containers/Registration";
import Login from "./containers/Login";
import AdminLayout from "./containers/admin/Layout";
import {requireAdmin} from "./actions/admin/layout";
import AdminUsers from "./containers/admin/Users";
import Forbidden from "./components/Forbidden";
import NotFound from "./components/NotFound";
import ServerError from "./components/ServerError";

export default (
    <Route component={App}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Index}/>
            <Route path="categories/:categoryId" component={ProductGrid}/>
        </Route>
        <Route path="registration" component={Registration}/>
        <Route path="login" component={Login}/>
        <Route path="admin" component={AdminLayout} onEnter={requireAdmin}>
            <Route path="users" component={AdminUsers}/>
        </Route>
        <Route path="forbidden" component={Forbidden}/>
        <Route path="servererror" component={ServerError}/>
        <Route path="*" component={NotFound}/>
    </Route>
)