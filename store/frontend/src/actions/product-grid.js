import {get, post} from "./api";
export const FETCH_PRODUCTS = 'PRODUCTS_GRID/FETCH_PRODUCTS';
export const FETCH_PRODUCTS_SUCCESS = 'PRODUCTS_GRID/FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'PRODUCTS_GRID/FETCH_PRODUCTS_FAILURE';

export function fetchProducts(categoryId) {
    return (dispatch) => {
        dispatch({type: FETCH_PRODUCTS});
        const url = `/api/categories/${categoryId}/products`;
        return get(url)
            .then((response) => dispatch({type: FETCH_PRODUCTS_SUCCESS, products: response.data}))
            .catch((errors) => dispatch({type: FETCH_PRODUCTS_FAILURE, errors}))
    }
}