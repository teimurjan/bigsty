import createReducer from './create-reducer';
import merge from 'xtend';
import {
    CHANGE_DESCRIPTION, CHANGE_DISCOUNT, CHANGE_IMAGE, CHANGE_NAME,
    CHANGE_PRICE, CHANGE_QUANTITY, CHANGE_CATEGORY, FETCH_CATEGORIES_SUCCESS,
    FETCH_CATEGORIES, FETCH_CATEGORIES_FAILURE,
    CREATE_PRODUCT_FAILURE, CREATE_PRODUCT,
    CREATE_PRODUCT_SUCCESS
} from "../actions/admin-product-creation";

const INITIAL_ERRORS_STATE = {
    name: [],
    description: [],
    price: [],
    quantity: [],
    discount: [],
    category: [],
    image: [],
    global: []
};

const INITIAL_STATE = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    discount: '',
    image: '',
    category: {},
    categories: [],
    errors: INITIAL_ERRORS_STATE,
    is_loading: false
};

export default createReducer({
    [CHANGE_IMAGE]: (state, action) => merge(state, {
        image: action.image
    }),
    [CHANGE_NAME]: (state, action) => merge(state, {
        name: action.name
    }),
    [CHANGE_DESCRIPTION]: (state, action) => merge(state, {
        description: action.description
    }),
    [CHANGE_PRICE]: (state, action) => merge(state, {
        price: action.price
    }),
    [CHANGE_DISCOUNT]: (state, action) => merge(state, {
        discount: action.discount
    }),
    [CHANGE_QUANTITY]: (state, action) => merge(state, {
        quantity: action.quantity
    }),
    [CHANGE_CATEGORY]: (state, action) => merge(state, {
        category: action.category
    }),
    [FETCH_CATEGORIES]: (state, action) => merge(state, {
        is_loading: true
    }),
    [FETCH_CATEGORIES_SUCCESS]: (state, action) => merge(state, {
        categories: action.categories,
        category: action.categories[0],
        is_loading: false
    }),
    [FETCH_CATEGORIES_FAILURE]: (state, action) => merge(state, {
        is_loading: false,
        errors: action.errors
    }),
    [CREATE_PRODUCT]: (state, action) => merge(state, {
        errors: INITIAL_ERRORS_STATE,
        is_loading: true
    }),
    [CREATE_PRODUCT_FAILURE]: (state, action) => merge(state, {
        errors: action.errors,
        is_loading: false
    }),
    [CREATE_PRODUCT_SUCCESS]: (state, action) => merge(state, INITIAL_STATE)
}, INITIAL_STATE)