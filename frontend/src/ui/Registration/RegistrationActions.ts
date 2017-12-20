import { Action } from '../../types/redux';
import { ActionCreator } from 'redux';

export type RegistrationActionType =
  'REGISTRATION/CHANGE_NAME' |
  'REGISTRATION/CHANGE_EMAIL' |
  'REGISTRATION/CHANGE_PASSWORD' |
  'REGISTRATION/SUBMIT' |
  'REGISTRATION/SUBMIT_SUCCESS' |
  'REGISTRATION/SUBMIT_FAILURE';

export const CHANGE_NAME: RegistrationActionType = 'REGISTRATION/CHANGE_NAME';
export const CHANGE_EMAIL: RegistrationActionType = 'REGISTRATION/CHANGE_EMAIL';
export const CHANGE_PASSWORD: RegistrationActionType = 'REGISTRATION/CHANGE_PASSWORD';
export const SUBMIT: RegistrationActionType = 'REGISTRATION/SUBMIT';
export const SUBMIT_SUCCESS: RegistrationActionType = 'REGISTRATION/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE: RegistrationActionType = 'REGISTRATION/SUBMIT_FAILURE';

type RegistrationAction = Action<RegistrationActionType>;

function changeEmail(email: string): RegistrationAction {
  return {type: CHANGE_EMAIL, payload: {email}};
}

function changeName(name: string): RegistrationAction {
  return {type: CHANGE_NAME, payload: {name}};
}

function changePassword(password: string): RegistrationAction {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

function submit(): RegistrationAction {
  return {type: SUBMIT};
}

export type RegistrationActionCreatorsMapObject = {
  changeEmail: ActionCreator<RegistrationAction>;
  changeName: ActionCreator<RegistrationAction>;
  changePassword: ActionCreator<RegistrationAction>;
  submit: ActionCreator<RegistrationAction>;
};

const RegistrationActionCreators: RegistrationActionCreatorsMapObject = {
  changeEmail,
  changeName,
  changePassword,
  submit
};
export default RegistrationActionCreators;