import createReducer from './create-reducer';
import merge from 'xtend';
import {
    REGISTRATION_REQUEST_FAILURE, CHANGE_NAME,
    CHANGE_EMAIL,
    CHANGE_PASSWORD, REGISTRATION_REQUEST, REGISTRATION_REQUEST_SUCCESS
} from "../actions/registration";

const INITIAL_ERRORS_STATE = {
    name: [],
    email: [],
    password: [],
    global: []
};

const INITIAL_STATE = {
    name: '',
    email: '',
    password: '',
    is_loading: false,
    errors: INITIAL_ERRORS_STATE
};

export default createReducer({
    [REGISTRATION_REQUEST]: (state, action) => merge(state, {
        errors: INITIAL_ERRORS_STATE,
        isLoading: true
    }),
    [REGISTRATION_REQUEST_FAILURE]: (state, action) => merge(state, {
        errors: merge(INITIAL_ERRORS_STATE, action.errors),
        isLoading: false
    }),
    [REGISTRATION_REQUEST_SUCCESS]: (state, action) => merge(state, {
        isLoading: false
    }),
    [CHANGE_NAME]: (state, action) => merge(state, {
        name: action.name
    }),
    [CHANGE_EMAIL]: (state, action) => merge(state, {
        email: action.email
    }),
    [CHANGE_PASSWORD]: (state, action) => merge(state, {
        password: action.password
    })
}, INITIAL_STATE);
