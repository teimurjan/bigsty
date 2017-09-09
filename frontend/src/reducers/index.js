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
import {USERS_ACTION_PREFIX, CATEGORIES_ACTION_PREFIX} from "../containers/admin/constants";

export default combineReducers({
  intl: intlReducer,
  routing,
  application,
  layout,
  productGrid,
  registration,
  login,
  adminLayout,
  adminUsers: getAdminTableReducer(USERS_ACTION_PREFIX),
  adminCategories: getAdminTableReducer(CATEGORIES_ACTION_PREFIX),
});