import {get, remove} from "./api";

export const FETCH_USERS = 'ADMIN_USERS/FETCH_USERS';
export const FETCH_USERS_SUCCESS = 'ADMIN_USERS/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'ADMIN_USERS/FETCH_USERS_FAILURE';

export const DELETE_USER = 'ADMIN_USERS/DELETE_USER';
export const DELETE_USER_SUCCESS = 'ADMIN_USERS/DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'ADMIN_USERS/DELETE_USER_FAILURE';

export const SHOW_DELETE_MODAL = 'ADMIN_USERS/SHOW_DELETE_MODAL';
export const HIDE_DELETE_MODAL = 'ADMIN_USERS/HIDE_DELETE_MODAL';

export function fetchUsers() {
  return (dispatch) => {
    dispatch({type: FETCH_USERS});
    const url = '/api/users';
    const token = localStorage.getItem('token');
    return get(url, token)
      .then(response => dispatch({type: FETCH_USERS_SUCCESS, users: response.data}))
      .catch(errors => dispatch({type: FETCH_USERS_FAILURE, errors}));
  }
}

export function deleteUser() {
  return (dispatch, getState) => {
    const userId = getState().adminUsers.userToDeleteId;
    const url = `/api/users/${userId}`;
    const token = localStorage.getItem('token');
    dispatch({type: DELETE_USER});
    return remove(url, token)
      .then(response => {
        dispatch(hideDeleteModal());
        dispatch({type: DELETE_USER_SUCCESS, userId});
      })
      .catch(errors => dispatch({type: DELETE_USER_FAILURE, errors}));
  }
}

export function showDeleteModal(userToDeleteId) {
  return {type: SHOW_DELETE_MODAL, userToDeleteId};
}

export function hideDeleteModal() {
  return {type: HIDE_DELETE_MODAL};
}