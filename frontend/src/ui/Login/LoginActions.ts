import { Action } from '../../types/redux';
import { ActionCreator } from 'redux';

export type LoginActionType =
  'LOGIN/CHANGE_EMAIL' |
  'LOGIN/CHANGE_PASSWORD' |
  'LOGIN/SUBMIT' |
  'LOGIN/SUBMIT_SUCCESS' |
  'LOGIN/SUBMIT_FAILURE';

export const CHANGE_EMAIL: LoginActionType = 'LOGIN/CHANGE_EMAIL';
export const CHANGE_PASSWORD: LoginActionType = 'LOGIN/CHANGE_PASSWORD';
export const SUBMIT: LoginActionType = 'LOGIN/SUBMIT';
export const SUBMIT_SUCCESS: LoginActionType = 'LOGIN/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE: LoginActionType = 'LOGIN/SUBMIT_FAILURE';

type LoginAction = Action<LoginActionType>;

function changeEmail(email: string): LoginAction {
  return {type: CHANGE_EMAIL, payload: {email}};
}

function changePassword(password: string): LoginAction {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

function submit(): LoginAction {
  return {type: SUBMIT};
}

export type LoginActionCreatorsMapObject = {
  changeEmail: ActionCreator<LoginAction>;
  changePassword: ActionCreator<LoginAction>;
  submit: ActionCreator<LoginAction>;
};

const LoginActionCreators: LoginActionCreatorsMapObject = {changeEmail, changePassword, submit};
export default LoginActionCreators;