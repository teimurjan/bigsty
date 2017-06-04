import createReducer from './create-reducer';
import merge from 'xtend';
import {
    DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, FETCH_USERS, FETCH_USERS_FAILURE,
    FETCH_USERS_SUCCESS
} from "../actions/admin-users";

const INITIAL_STATE = {
    users: [],
    is_loading: false
};

export default createReducer({
    [FETCH_USERS]: (state, action) => merge(state, {
        is_loading: true
    }),
    [FETCH_USERS_SUCCESS]: (state, action) => merge(state, {
        is_loading: false,
        users: action.users
    }),
    [FETCH_USERS_FAILURE]: (state, action) => merge(state, {
        is_loading: false
    }),
    [DELETE_USER]: (state, action) => merge(state, {
        is_loading: true
    }),
    [DELETE_USER_SUCCESS]: (state, action) => merge(state, {
        is_loading: false,
        users: state.users.filter((user) => user.id !== action.userId)
    }),
    [DELETE_USER_FAILURE]: (state, action) => merge(state, {
        is_loading: false
    }),
}, INITIAL_STATE);
