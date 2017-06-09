import {get, post} from "./api";
import {push} from 'react-router-redux';

export const CHANGE_IMAGE = 'ADMIN_PRODUCT_CREATION/CHANGE_IMAGE';
export const CHANGE_NAME = 'ADMIN_PRODUCT_CREATION/CHANGE_NAME';
export const CHANGE_DESCRIPTION = 'ADMIN_PRODUCT_CREATION/CHANGE_DESCRIPTION';
export const CHANGE_PRICE = 'ADMIN_PRODUCT_CREATION/CHANGE_PRICE';
export const CHANGE_DISCOUNT = 'ADMIN_PRODUCT_CREATION/CHANGE_DISCOUNT';
export const CHANGE_QUANTITY = 'ADMIN_PRODUCT_CREATION/CHANGE_QUANTITY';
export const CHANGE_CATEGORY = 'ADMIN_PRODUCT_CREATION/CHANGE_CATEGORY';

export const FETCH_CATEGORIES = 'ADMIN_PRODUCT_CREATION/FETCH_CATEGORIES';
export const FETCH_CATEGORIES_SUCCESS = 'ADMIN_PRODUCT_CREATION/FETCH_CATEGORIES_SUCCESS';
export const FETCH_CATEGORIES_FAILURE = 'ADMIN_PRODUCT_CREATION/FETCH_CATEGORIES_FAILURE';

export const CREATE_PRODUCT = 'ADMIN_PRODUCT_CREATION/CREATE_PRODUCT';
export const CREATE_PRODUCT_SUCCESS = 'ADMIN_PRODUCT_CREATION/CREATE_PRODUCT_SUCCESS';
export const CREATE_PRODUCT_FAILURE = 'ADMIN_PRODUCT_CREATION/CREATE_PRODUCT_FAILURE';

export let changeImage = (imageBase64) => ({type: CHANGE_IMAGE, image: imageBase64});
export let changeName = (name) => ({type: CHANGE_NAME, name});
export let changeDescription = (description) => ({type: CHANGE_DESCRIPTION, description});
export let changePrice = (price) => ({type: CHANGE_PRICE, price});
export let changeDiscount = (discount) => ({type: CHANGE_DISCOUNT, discount});
export let changeQuantity = (quantity) => ({type: CHANGE_QUANTITY, quantity});
export let changeCategory = (category) => ({type: CHANGE_CATEGORY, category});

export function fetchCategories() {
    return (dispatch) => {
        dispatch({type: FETCH_CATEGORIES});
        const url = '/api/categories';
        return get(url)
            .then((response) => dispatch({type: FETCH_CATEGORIES_SUCCESS, categories: response.data}))
            .catch((errors) => dispatch({type: FETCH_CATEGORIES_FAILURE, errors}))
    }
}

export function createProduct() {
    return (dispatch, getState) => {
        dispatch({type: CREATE_PRODUCT});
        const {
            name, description, price, discount,
            quantity, category, image
        } = getState().adminProductCreation;
        const token = localStorage.getItem('token');
        const url = '/api/products';
        return post(url, {
            name, description, price,
            discount, quantity, category: category.id, image
        }, token)
            .then((response) => {
                dispatch(push('/admin/products'));
                dispatch({type: CREATE_PRODUCT_SUCCESS})
            })
            .catch((errors) => dispatch({type: CREATE_PRODUCT_FAILURE, errors}))
    }
}