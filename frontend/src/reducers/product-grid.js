import createReducer from './create-reducer';
import update from 'react-addons-update';
import {FETCH_PRODUCTS,FETCH_PRODUCTS_FAILURE, FETCH_PRODUCTS_SUCCESS} from "../actions/product-grid";

const INITIAL_STATE = {
    products: []
};

export default createReducer({
    [FETCH_PRODUCTS_SUCCESS]: (state, action) => update(state, {
        products: {$set: action.products}
    })
}, INITIAL_STATE);
