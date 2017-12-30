import { ActionCreator } from 'redux';
import { Action } from '../../../../typings/redux-custom';

export type AddUserActionType =
  'ADD_USER/ADD' |
  'ADD_USER/ADD_SUCCESS' |
  'ADD_USER/ADD_FAILURE' |
  'ADD_USER/FETCH_GROUPS' |
  'ADD_USER/FETCH_GROUPS_SUCCESS' |
  'ADD_USER/FETCH_GROUPS_FAILURE';

type AddUserAction = Action<AddUserActionType>;

export type AddUserActionCreatorsMapObject = {
  addUser: ActionCreator<AddUserAction>;
  fetchGroups: ActionCreator<AddUserAction>;
};

export const ADD_USER: AddUserActionType = 'ADD_USER/ADD';
export const ADD_USER_SUCCESS: AddUserActionType = 'ADD_USER/ADD_SUCCESS';
export const ADD_USER_FAILURE: AddUserActionType = 'ADD_USER/ADD_FAILURE';
export const FETCH_GROUPS: AddUserActionType = 'ADD_USER/FETCH_GROUPS';
export const FETCH_GROUPS_SUCCESS: AddUserActionType = 'ADD_USER/FETCH_GROUPS_SUCCESS';
export const FETCH_GROUPS_FAILURE: AddUserActionType = 'ADD_USER/FETCH_GROUPS_FAILURE';

function addUser(): AddUserAction {
  return {type: ADD_USER};
}

function fetchGroups(): AddUserAction {
  return {type: FETCH_GROUPS};
}

const addUserActionCreators: AddUserActionCreatorsMapObject = {
  addUser, fetchGroups
};

export default addUserActionCreators;