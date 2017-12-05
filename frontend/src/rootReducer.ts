import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import {intlReducer as intl} from 'react-intl-redux'
import login from './ui/Login/LoginReducer';
import registration from './ui/Registration/RegistrationReducer';

export interface RootState {
  routing: any;
  login: any;
  intl: any;
  registration: any;
}

export default combineReducers<RootState>({
  routing, login, intl, registration
});
