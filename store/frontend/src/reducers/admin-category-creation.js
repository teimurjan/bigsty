import createReducer from './create-reducer';
import merge from 'xtend';
import {CHANGE_NAME, CREATE_CATEGORY, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE} from "../actions/admin-category-creation";

const INITIAL_ERRORS_STATE = {
    name: [],
    global: []
};

const INITIAL_STATE = {
    name: '',
    errors: INITIAL_ERRORS_STATE,
    isLoading: false
};

export default createReducer({
    [CHANGE_NAME]: (state, action) => merge(state, {
        name: action.name
    }),
    [CREATE_CATEGORY]: (state, action) => merge(state, {
        errors: INITIAL_ERRORS_STATE,
        isLoading: true
    }),
    [CREATE_CATEGORY_SUCCESS]: (state, action) => merge(state, INITIAL_STATE),
    [CREATE_CATEGORY_FAILURE]: (state, action) => merge(state, {
        errors: action.errors,
        isLoading: false
    })
}, INITIAL_STATE)