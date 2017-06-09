import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './containers/App';
import Layout from "./containers/Layout";
import Index from "./components/Index";
import ProductGrid from "./containers/ProductGrid";
import Registration from "./containers/Registration";
import Login from "./containers/Login";
import AdminMain from "./containers/admin/AdminMain";
import {requireAdmin} from "./actions/admin-main";
import AdminUsers from "./containers/admin/AdminUsers";
import AdminProducts from "./containers/admin/AdminProducts";
import AdminProductCreation from "./containers/admin/AdminProductCreation";

export default (
    <Route component={App}>
        <Route path="/" component={Layout}>
            <IndexRoute component={Index}/>
            <Route path="categories/:categoryId" component={ProductGrid}/>
        </Route>
        <Route path="registration" component={Registration}/>
        <Route path="login" component={Login}/>
        <Route path="admin" component={AdminMain} onEnter={requireAdmin}>
            <Route path="users" component={AdminUsers}/>
            <Route path="products" component={AdminProducts}/>
            <Route path="products/add" component={AdminProductCreation}/>
        </Route>
    </Route>
)