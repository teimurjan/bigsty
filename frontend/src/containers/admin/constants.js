export const USERS_INTL_PREFIX = 'adminUsers';
export const USERS_ACTION_PREFIX = 'ADMIN_USERS/';
export const USERS_COL_PROPS = [
  {dataField: 'id'},
  {dataSort: true, dataField: 'name'},
  {dataSort: true, dataField: 'email'},
  {dataSort: true, dataField: 'group'},
  {dataField: 'actions'}
];
export const USERS_BASE_URL = '/api/users';

export const CATEGORIES_INTL_PREFIX = 'adminCategories';
export const CATEGORIES_ACTION_PREFIX = 'ADMIN_CATEGORIES/';
export const CATEGORIES_COL_PROPS = [
  {dataField: 'id'},
  {dataSort: true, dataField: 'name'},
  {dataField: 'actions'}
];
export const CATEGORIES_BASE_URL = '/api/categories';