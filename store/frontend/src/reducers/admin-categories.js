import createReducer from './create-reducer';
import merge from 'xtend';
import {FETCH_CATEGORIES, FETCH_CATEGORIES_FAILURE, FETCH_CATEGORIES_SUCCESS} from "../actions/admin-categories";

const INITIAL_STATE = {
    categories: [],
    isLoading: false
};

export default createReducer({
    [FETCH_CATEGORIES]: (state, action) => merge(state, {
        isLoading: true
    }),
    [FETCH_CATEGORIES_SUCCESS]: (state, action) => merge(state, {
        isLoading: false,
        categories: action.categories
    }),
    [FETCH_CATEGORIES_FAILURE]: (state, action) => merge(state, {
        isLoading: false
    }),
}, INITIAL_STATE);
