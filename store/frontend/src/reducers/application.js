import createReducer from './create-reducer';
import merge from 'xtend';
import {LOGIN_SUCCESS, LOGOUT} from "../actions/login";

const INITIAL_STATE = {
    isAuthenticated: false,
};

export default createReducer({
    [LOGIN_SUCCESS]: (state, action) => merge(state, {
        isAuthenticated: true
    }),
    [LOGOUT]: (state, action) => merge(state, {
        isAuthenticated: false
    })
}, INITIAL_STATE);
