import { ActionCreator } from 'redux';
import { Action } from '../../../../typings/redux-custom';

export type DeleteUserActionType =
  'DELETE_USER/OPEN' |
  'DELETE_USER/CLOSE' |
  'DELETE_USER/DELETE' |
  'DELETE_USER/DELETE_SUCCESS' |
  'DELETE_USER/DELETE_FAILURE';

export type DeleteUserAction = Action<DeleteUserActionType>;

export type DeleteUserActionCreatorsMapObject = {
  deleteUser: ActionCreator<DeleteUserAction>;
  close: ActionCreator<DeleteUserAction>;
};

export const DELETE_USER: DeleteUserActionType = 'DELETE_USER/DELETE';
export const DELETE_USER_SUCCESS: DeleteUserActionType = 'DELETE_USER/DELETE_SUCCESS';
export const DELETE_USER_FAILURE: DeleteUserActionType = 'DELETE_USER/DELETE_FAILURE';
export const OPEN: DeleteUserActionType = 'DELETE_USER/OPEN';
export const CLOSE: DeleteUserActionType = 'DELETE_USER/CLOSE';

export function open(userId: number): DeleteUserAction {
  return {type: OPEN, payload: {userId}};
}

export function close(): DeleteUserAction {
  return {type: CLOSE};
}

function deleteUser(): DeleteUserAction {
  return {type: DELETE_USER};
}

const deleteUserActionCreators: DeleteUserActionCreatorsMapObject = {
  deleteUser, close
};

export default deleteUserActionCreators;