import {push} from 'react-router-redux';
import {post} from "./api";

export const CHANGE_EMAIL = 'LOGIN/CHANGE_EMAIL';
export const CHANGE_PASSWORD = 'LOGIN/CHANGE_PASSWORD';
export const LOGIN_REQUEST = 'LOGIN/LOGIN_REQUEST';
export const LOGIN_REQUEST_SUCCESS = 'LOGIN/LOGIN_REQUEST_SUCCESS';
export const LOGIN_REQUEST_FAILURE = 'LOGIN/REGISTRATION_REQUEST_FAILURE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export function loadAuth() {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        if (token)
            dispatch({type: LOGIN_SUCCESS, token});
    }
}

export function login() {
    return (dispatch, getState) => {
        const {email, password} = getState().login;
        const url = '/api/login';
        dispatch({type: LOGIN_REQUEST});
        return post(url, {email, password})
            .then((response) => {
                dispatch({type: LOGIN_REQUEST_SUCCESS});
                dispatch(loginSuccess(response.token));
            })
            .catch((errors) => dispatch({type: LOGIN_REQUEST_FAILURE, errors}))
    }
}

export function loginSuccess(token) {
    localStorage.setItem('token', token);
    return (dispatch) => {
        dispatch({type: LOGIN_SUCCESS});
        dispatch(push('/?from=auth'))
    };
}

export function logout() {
    localStorage.removeItem('token');
    return (dispatch) => {
        dispatch({type: LOGOUT});
        dispatch(push('/login'));
    };
}

export let changeEmail = (email) => ({type: CHANGE_EMAIL, email});
export let changePassword = (password) => ({type: CHANGE_PASSWORD, password});
