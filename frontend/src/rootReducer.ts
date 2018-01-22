import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { intlReducer as intl } from 'react-intl-redux';
import app, { AppState } from './ui/App/reducer';
import login, { LoginState } from './ui/Login/reducer';
import registration, { RegistrationState } from './ui/Registration/reducer';
import adminUsers, { UsersState as AdminUsersState } from './ui/Admin/Users/Index/reducer';
import adminAddUser, { AddUserState as AdminAddUserState } from './ui/Admin/Users/Add/reducer';
import adminDeleteUser, { DeleteUserState as AdminDeleteUserState } from './ui/Admin/Users/Delete/reducer';
import { Map as ImmutableMap } from 'immutable';

export interface RootState {
  routing: ImmutableMap<string, {}>;
  intl: ImmutableMap<string, {}>;
  app: ImmutableMap<keyof AppState, {}>;
  login: ImmutableMap<keyof LoginState, {}>;
  registration: ImmutableMap<keyof RegistrationState, {}>;
  adminUsers: ImmutableMap<keyof AdminUsersState, {}>;
  adminAddUser: ImmutableMap<keyof AdminAddUserState, {}>;
  adminDeleteUser: ImmutableMap<keyof AdminDeleteUserState, {}>;
}

export default combineReducers<RootState>({
  routing, intl, app, login, registration, adminUsers, adminAddUser, adminDeleteUser
});
