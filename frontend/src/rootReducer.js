import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import {intlReducer as intl} from 'react-intl-redux'
import login from './ui/Login/LoginReducer';

export default combineReducers({
  routing, login, intl,
});
