import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { intlReducer as intl } from 'react-intl-redux';
import login from './ui/Login/reducer';
import registration from './ui/Registration/reducer';
import adminUsersIndex from './ui/Admin/Users/Index/reducer';
import { Map } from 'immutable';

export interface RootState {
  routing: Map<string, {}>;
  login: Map<string, {}>;
  intl: Map<string, {}>;
  registration: Map<string, {}>;
  adminUsersIndex: Map<string, {}>;
}

export default combineReducers<RootState>({
  routing, login, intl, registration, adminUsersIndex
});
