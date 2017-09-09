import {get, post} from "./api";
export const FETCH_CATEGORIES = 'NAVBAR/FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESS = 'NAVBAR/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'NAVBAR/FETCH_CATEGORIES_FAILURE';


export function fetchCategories() {
    return (dispatch) => {
        dispatch({type: FETCH_CATEGORIES});
        const url = '/api/categories';
        return get(url)
            .then((response) => dispatch({type: FETCH_CATEGORIES_SUCCESS, categories: response.data}))
            .catch((errors) => dispatch({type: FETCH_CATEGORIES_FAILURE, errors}))
    }
}