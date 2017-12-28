import { ActionCreator, } from 'redux';
import { Action } from '../../../../typings/redux-custom';

export type UsersIndexActionType =
  'USERS_INDEX/FETCH_USERS' |
  'USERS_INDEX/FETCH_USERS_SUCCESS' |
  'USERS_INDEX/FETCH_USERS_FAILURE' |
  'USERS_INDEX/ADD_USER' |
  'USERS_INDEX/ADD_USER_SUCCESS' |
  'USERS_INDEX/ADD_USER_FAILURE' |
  'USERS_INDEX/EDIT_USER' |
  'USERS_INDEX/EDIT_USER_SUCCESS' |
  'USERS_INDEX/EDIT_USER_FAILURE' |
  'USERS_INDEX/DELETE_USER' |
  'USERS_INDEX/DELETE_USER_SUCCESS' |
  'USERS_INDEX/DELETE_USER_FAILURE';

export const FETCH_USERS: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS';
export const FETCH_USERS_SUCCESS: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE: UsersIndexActionType = 'USERS_INDEX/FETCH_USERS_FAILURE';

export const ADD_USER: UsersIndexActionType = 'USERS_INDEX/ADD_USER';
export const ADD_USER_SUCCESS: UsersIndexActionType = 'USERS_INDEX/ADD_USER_SUCCESS';
export const ADD_USER_FAILURE: UsersIndexActionType = 'USERS_INDEX/ADD_USER_FAILURE';

export const EDIT_USER: UsersIndexActionType = 'USERS_INDEX/EDIT_USER';
export const EDIT_USER_SUCCESS: UsersIndexActionType = 'USERS_INDEX/EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE: UsersIndexActionType = 'USERS_INDEX/EDIT_USER_FAILURE';

export const DELETE_USER: UsersIndexActionType = 'USERS_INDEX/DELETE_USER';
export const DELETE_USER_SUCCESS: UsersIndexActionType = 'USERS_INDEX/DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE: UsersIndexActionType = 'USERS_INDEX/DELETE_USER_FAILURE';

type UsersIndexAction = Action<UsersIndexActionType>;

function fetchUsers(): UsersIndexAction {
  return {type: FETCH_USERS};
}

function addUser(): UsersIndexAction {
  return {type: ADD_USER};
}

function deleteUser(userId: number): UsersIndexAction {
  return {type: DELETE_USER, payload: {userId}};
}

function editUser(userId: number): UsersIndexAction {
  return {type: DELETE_USER, payload: {userId}};
}

export type UsersIndexActionCreatorsMapObject = {
  fetchUsers: ActionCreator<UsersIndexAction>;
  addUser: ActionCreator<UsersIndexAction>;
  deleteUser: ActionCreator<UsersIndexAction>;
  editUser: ActionCreator<UsersIndexAction>;
};

const UsersIndexActionCreators: UsersIndexActionCreatorsMapObject = {
  fetchUsers, addUser, deleteUser, editUser
};
export default UsersIndexActionCreators;