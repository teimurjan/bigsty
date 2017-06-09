import createReducer from './create-reducer';
import merge from 'xtend';
import {
    DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, FETCH_USERS, FETCH_USERS_FAILURE,
    FETCH_USERS_SUCCESS
} from "../actions/admin-users";

const INITIAL_STATE = {
    users: [],
    isLoading: false
};

export default createReducer({
    [FETCH_USERS]: (state, action) => merge(state, {
        isLoading: true
    }),
    [FETCH_USERS_SUCCESS]: (state, action) => merge(state, {
        isLoading: false,
        users: action.users
    }),
    [FETCH_USERS_FAILURE]: (state, action) => merge(state, {
        isLoading: false
    }),
    [DELETE_USER]: (state, action) => merge(state, {
        isLoading: true
    }),
    [DELETE_USER_SUCCESS]: (state, action) => merge(state, {
        isLoading: false,
        users: state.users.filter((user) => user.id !== action.userId)
    }),
    [DELETE_USER_FAILURE]: (state, action) => merge(state, {
        isLoading: false
    }),
}, INITIAL_STATE);
