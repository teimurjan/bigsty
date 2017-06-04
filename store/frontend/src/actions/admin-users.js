import {get, post, remove} from "./api";
export const FETCH_USERS = 'ADMIN_USERS/FETCH_USERS';
export const FETCH_USERS_SUCCESS = 'ADMIN_USERS/FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'ADMIN_USERS/FETCH_USERS_FAILURE';

export const DELETE_USER = 'ADMIN/DELETE_USER';
export const DELETE_USER_SUCCESS = 'ADMIN/DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'ADMIN/DELETE_USER_FAILURE';

export function fetchUsers(){
    return (dispatch) => {
        dispatch({type: FETCH_USERS});
        const url = '/api/users';
        const token = localStorage.getItem('token');
        return get(url, token)
            .then((response) => dispatch({type: FETCH_USERS_SUCCESS, users: response.data}))
            .catch((errors) => dispatch({type: FETCH_USERS_FAILURE, errors}))
    }
}

export function deleteUser(userId){
    return (dispatch) => {
        dispatch({type: DELETE_USER});
        const url = `/api/users/${userId}`;
        const token = localStorage.getItem('token');
        return remove(url, token)
            .then((response) => dispatch({type: DELETE_USER_SUCCESS, userId}))
            .catch((errors) => dispatch({type: DELETE_USER_FAILURE, errors}))
    }
}