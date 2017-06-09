import createReducer from './create-reducer';
import merge from 'xtend';
import {
    LOGIN_REQUEST_FAILURE,
    CHANGE_EMAIL,
    CHANGE_PASSWORD, LOGIN_REQUEST, LOGIN_REQUEST_SUCCESS
} from "../actions/login";

const INITIAL_ERRORS_STATE = {
    email: [],
    password: [],
    global: []
};

const INITIAL_STATE = {
    email: '',
    password: '',
    is_loading: false,
    errors: INITIAL_ERRORS_STATE
};

export default createReducer({
    [LOGIN_REQUEST]: (state, action) => merge(state, {
        errors: INITIAL_ERRORS_STATE,
        isLoading: true
    }),
    [LOGIN_REQUEST_FAILURE]: (state, action) => merge(state, {
        errors: merge(INITIAL_ERRORS_STATE, action.errors),
        isLoading: false
    }),
    [LOGIN_REQUEST_SUCCESS]: (state, action) => merge(state, {
        isLoading: false
    }),
    [CHANGE_EMAIL]: (state, action) => merge(state, {
        email: action.email
    }),
    [CHANGE_PASSWORD]: (state, action) => merge(state, {
        password: action.password
    })
}, INITIAL_STATE);
