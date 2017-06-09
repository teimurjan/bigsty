import createReducer from './create-reducer';
import merge from 'xtend';
import {FETCH_PRODUCTS, FETCH_PRODUCTS_FAILURE, FETCH_PRODUCTS_SUCCESS} from "../actions/admin-products";

const INITIAL_STATE = {
    products: [],
    isLoading: false
};

export default createReducer({
    [FETCH_PRODUCTS]: (state, action) => merge(state, {
        isLoading: true
    }),
    [FETCH_PRODUCTS_SUCCESS]: (state, action) => merge(state, {
        isLoading: false,
        products: action.products
    }),
    [FETCH_PRODUCTS_FAILURE]: (state, action) => merge(state, {
        isLoading: false
    }),
}, INITIAL_STATE);
