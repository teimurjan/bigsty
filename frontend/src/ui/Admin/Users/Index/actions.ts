import { ActionCreator, } from 'redux';
import { Action } from '../../../../typings/redux-custom';

export type UsersActionType =
  'USERS/FETCH_USERS' |
  'USERS/FETCH_USERS_SUCCESS' |
  'USERS/FETCH_USERS_FAILURE' |
  'USERS/EDIT_USER' |
  'USERS/EDIT_USER_SUCCESS' |
  'USERS/EDIT_USER_FAILURE' |
  'USERS/DELETE_USER' |
  'USERS/DELETE_USER_SUCCESS' |
  'USERS/DELETE_USER_FAILURE';

type UsersAction = Action<UsersActionType>;

export type UsersActionCreatorsMapObject = {
  fetchUsers: ActionCreator<UsersAction>;
  deleteUser: ActionCreator<UsersAction>;
  editUser: ActionCreator<UsersAction>;
};

export const FETCH_USERS: UsersActionType = 'USERS/FETCH_USERS';
export const FETCH_USERS_SUCCESS: UsersActionType = 'USERS/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE: UsersActionType = 'USERS/FETCH_USERS_FAILURE';

export const EDIT_USER: UsersActionType = 'USERS/EDIT_USER';
export const EDIT_USER_SUCCESS: UsersActionType = 'USERS/EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE: UsersActionType = 'USERS/EDIT_USER_FAILURE';

export const DELETE_USER: UsersActionType = 'USERS/DELETE_USER';
export const DELETE_USER_SUCCESS: UsersActionType = 'USERS/DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE: UsersActionType = 'USERS/DELETE_USER_FAILURE';


function fetchUsers(): UsersAction {
  return {type: FETCH_USERS};
}

function deleteUser(userId: number): UsersAction {
  return {type: DELETE_USER, payload: {userId}};
}

function editUser(userId: number): UsersAction {
  return {type: DELETE_USER, payload: {userId}};
}

const usersActionCreators: UsersActionCreatorsMapObject = {
  fetchUsers, deleteUser, editUser
};
export default usersActionCreators;