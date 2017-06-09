import {get, remove} from "./api";
export const FETCH_PRODUCTS = 'ADMIN_PRODUCTS/FETCH_PRODUCTS';
export const FETCH_PRODUCTS_SUCCESS = 'ADMIN_PRODUCTS/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'ADMIN_PRODUCTS/FETCH_PRODUCTS_FAILURE';

export function fetchProducts() {
    return (dispatch) => {
        dispatch({type: FETCH_PRODUCTS});
        const url = '/api/products';
        const token = localStorage.getItem('token');
        return get(url, token)
            .then((response) => dispatch({type: FETCH_PRODUCTS_SUCCESS, products: response.data}))
            .catch((errors) => dispatch({type: FETCH_PRODUCTS_FAILURE, errors}))
    }
}