import {get, remove} from "../api";

export const FETCH = '/FETCH';
export const FETCH_SUCCESS = '/FETCH_SUCCESS';
export const FETCH_FAILURE = '/FETCH_FAILURE';

export const DELETE = '/DELETE';
export const DELETE_SUCCESS = '/DELETE_SUCCESS';
export const DELETE_FAILURE = '/DELETE_FAILURE';

export const SHOW_DELETE_MODAL = '/SHOW_DELETE_MODAL';
export const HIDE_DELETE_MODAL = '/HIDE_DELETE_MODAL';


export function getAdminTableActions(prefix, baseUrl) {
  function fetchModels() {
    return (dispatch) => {
      dispatch({type: prefix + FETCH});
      const token = localStorage.getItem('token');
      return get(baseUrl, token)
        .then(response => dispatch({type: prefix + FETCH_SUCCESS, models: response.data}))
        .catch(errors => dispatch({type: prefix + FETCH_FAILURE, errors}));
    }
  }

  function deleteModel() {
    return (dispatch, getState) => {
      const modelId = getState().adminUsers.modelToDeleteId;
      const url = `${baseUrl}/${modelId}`;
      const token = localStorage.getItem('token');
      dispatch({type: prefix + DELETE});
      return remove(url, token)
        .then(response => {
          dispatch(hideDeleteModal());
          dispatch({type: prefix + DELETE_SUCCESS, modelId});
        })
        .catch(errors => dispatch({type: prefix + DELETE_FAILURE, errors}));
    }
  }

  const showDeleteModal = modelToDeleteId => ({type: prefix + SHOW_DELETE_MODAL, modelToDeleteId});
  const hideDeleteModal = () => ({type: prefix + HIDE_DELETE_MODAL});

  return {fetchModels, deleteModel, showDeleteModal, hideDeleteModal}
}