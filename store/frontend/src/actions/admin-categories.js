import {get, remove} from "./api";
export const FETCH_CATEGORIES = 'ADMIN_CATEGORIES/FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESS = 'ADMIN_CATEGORIES/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'ADMIN_CATEGORIES/FETCH_CATEGORIES_FAILURE';

export function fetchCategories() {
    return (dispatch) => {
        dispatch({type: FETCH_CATEGORIES});
        const url = '/api/categories';
        return get(url)
            .then((response) => dispatch({type: FETCH_CATEGORIES_SUCCESS, categories: response.data}))
            .catch((errors) => dispatch({type: FETCH_CATEGORIES_FAILURE, errors}))
    }
}