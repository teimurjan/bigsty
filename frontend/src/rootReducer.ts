import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { intlReducer as intl } from 'react-intl-redux';
import login, { LoginState } from './ui/Login/reducer';
import registration, { RegistrationState } from './ui/Registration/reducer';
import adminUsers, { UsersState as AdminUsersState } from './ui/Admin/Users/Index/reducer';
import adminAddUser, { AddUserState as AdminAddUserState } from './ui/Admin/Users/Add/reducer';
import { Map } from 'immutable';

export interface RootState {
  routing: Map<string, {}>;
  login: Map<keyof LoginState, {}>;
  intl: Map<string, {}>;
  registration: Map<keyof RegistrationState, {}>;
  adminUsers: Map<keyof AdminUsersState, {}>;
  adminAddUser: Map<keyof AdminAddUserState, {}>;
}

export default combineReducers<RootState>({
  routing, login, intl, registration, adminUsers, adminAddUser
});
