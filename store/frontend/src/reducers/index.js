import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import layout from './layout';
import productGrid from './product-grid';
import registration from './registration';
import application from "./application";
import login from "./login";
import adminMain from "./admin-main";
import adminUsers from "./admin-users";

export default combineReducers({
    routing,
    application,
    layout,
    productGrid,
    registration,
    login,
    adminMain,
    adminUsers
});