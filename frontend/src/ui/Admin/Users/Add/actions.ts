import { ActionCreator } from 'redux';
import { Action } from '../../../../typings/redux-custom';
import { Group } from '../../../../typings/api-models';

export type AddUserActionType =
  'ADD_USER/ADD' |
  'ADD_USER/ADD_SUCCESS' |
  'ADD_USER/ADD_FAILURE' |
  'ADD_USER/FETCH_GROUPS' |
  'ADD_USER/FETCH_GROUPS_SUCCESS' |
  'ADD_USER/FETCH_GROUPS_FAILURE' |
  'ADD_USER/CHANGE_NAME' |
  'ADD_USER/CHANGE_EMAIL' |
  'ADD_USER/CHANGE_GROUP' |
  'ADD_USER/CHANGE_PASSWORD';

type AddUserAction = Action<AddUserActionType>;

export type AddUserActionCreatorsMapObject = {
  addUser: ActionCreator<AddUserAction>;
  fetchGroups: ActionCreator<AddUserAction>;
  changeName: ActionCreator<AddUserAction>;
  changeEmail: ActionCreator<AddUserAction>;
  changeGroup: ActionCreator<AddUserAction>;
  changePassword: ActionCreator<AddUserAction>;
};

export const ADD_USER: AddUserActionType = 'ADD_USER/ADD';
export const ADD_USER_SUCCESS: AddUserActionType = 'ADD_USER/ADD_SUCCESS';
export const ADD_USER_FAILURE: AddUserActionType = 'ADD_USER/ADD_FAILURE';
export const FETCH_GROUPS: AddUserActionType = 'ADD_USER/FETCH_GROUPS';
export const FETCH_GROUPS_SUCCESS: AddUserActionType = 'ADD_USER/FETCH_GROUPS_SUCCESS';
export const FETCH_GROUPS_FAILURE: AddUserActionType = 'ADD_USER/FETCH_GROUPS_FAILURE';
export const CHANGE_NAME: AddUserActionType = 'ADD_USER/CHANGE_NAME';
export const CHANGE_EMAIL: AddUserActionType = 'ADD_USER/CHANGE_EMAIL';
export const CHANGE_GROUP: AddUserActionType = 'ADD_USER/CHANGE_GROUP';
export const CHANGE_PASSWORD: AddUserActionType = 'ADD_USER/CHANGE_PASSWORD';

function addUser(): AddUserAction {
  return {type: ADD_USER};
}

function fetchGroups(): AddUserAction {
  return {type: FETCH_GROUPS};
}

function changeName(name: string): AddUserAction {
  return {type: CHANGE_NAME, payload: {name}};
}

function changeEmail(email: string): AddUserAction {
  return {type: CHANGE_EMAIL, payload: {email}};
}

function changeGroup(group: Group): AddUserAction {
  return {type: CHANGE_GROUP, payload: {group}};
}

function changePassword(password: string): AddUserAction {
  return {type: CHANGE_PASSWORD, payload: {password}};
}

const addUserActionCreators: AddUserActionCreatorsMapObject = {
  addUser, fetchGroups, changeEmail, changeName, changeGroup, changePassword
};

export default addUserActionCreators;