import {post} from "./api";
import {loginSuccess} from "./login";
export const REGISTRATION_REQUEST = 'REGISTRATION/REGISTRATION_REQUEST';
export const REGISTRATION_REQUEST_SUCCESS = 'REGISTRATION/REGISTRATION_REQUEST_SUCCESS';
export const REGISTRATION_REQUEST_FAILURE = 'REGISTRATION/REGISTRATION_REQUEST_FAILURE';
export const CHANGE_NAME = 'REGISTRATION/CHANGE_NAME';
export const CHANGE_EMAIL = 'REGISTRATION/CHANGE_EMAIL';
export const CHANGE_PASSWORD = 'REGISTRATION/CHANGE_PASSWORD';

export function register() {
    return (dispatch, getState) => {
        dispatch({type: REGISTRATION_REQUEST});
        const url = `/api/register`;
        const {name, email, password} = getState().registration;
        return post(url, {name, email, password})
            .then((response) => {
                const token = response.token;
                dispatch({type: REGISTRATION_REQUEST_SUCCESS});
                dispatch(loginSuccess(token));
            })
            .catch((errors) => dispatch({type: REGISTRATION_REQUEST_FAILURE, errors}))
    }
}

export let changeName = (name) => ({type: CHANGE_NAME, name});
export let changeEmail = (email) => ({type: CHANGE_EMAIL, email});
export let changePassword = (password) => ({type: CHANGE_PASSWORD, password});
