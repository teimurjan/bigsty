import {post} from "./api";
import {push} from 'react-router-redux';
export const CHANGE_NAME = 'ADMIN_CATEGORY_CREATION/CHANGE_NAME';
export const CREATE_CATEGORY = 'ADMIN_CATEGORY_CREATION/CREATE_CATEGORY';
export const CREATE_CATEGORY_SUCCESS = 'ADMIN_CATEGORY_CREATION/CREATE_CATEGORY_SUCCESS';
export const CREATE_CATEGORY_FAILURE = 'ADMIN_CATEGORY_CREATION/CREATE_CATEGORY_FAILURE';

export let changeName = (name) => ({type: CHANGE_NAME, name});

export function createCategory() {
    return (dispatch, getState) => {
        dispatch({type: CREATE_CATEGORY});
        const name = getState().adminCategoryCreation.name;
        const url = '/api/categories';
        const token = localStorage.getItem('token');
        return post(url, {name}, token)
            .then((response) => {
                dispatch(push('/admin/categories'));
                dispatch({type: CREATE_CATEGORY_SUCCESS})
            })
            .catch((errors) => {
                dispatch({type: CREATE_CATEGORY_FAILURE, errors})
            })

    }
}