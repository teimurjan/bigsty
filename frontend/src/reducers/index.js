import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import {intlReducer} from 'react-intl-redux'
import layout from './layout';
import productGrid from './product-grid';
import registration from './registration';
import application from "./application";
import login from "./login";
import adminLayout from "./admin/layout";
import {getAdminTableReducer} from "./admin/admin-table";
import {ADMIN_USERS_PREFIX} from "../containers/admin/Users";

export default combineReducers({
  intl: intlReducer,
  routing,
  application,
  layout,
  productGrid,
  registration,
  login,
  adminLayout,
  adminUsers: getAdminTableReducer(ADMIN_USERS_PREFIX)
});