import createReducer from '../create-reducer';
import merge from 'xtend';
import {
  DELETE, DELETE_FAILURE, DELETE_SUCCESS, FETCH, FETCH_FAILURE,
  FETCH_SUCCESS, HIDE_DELETE_MODAL, SHOW_DELETE_MODAL
} from "../../actions/admin/admin-table";

const INITIAL_STATE = {
  models: [],
  isLoading: false,
  modelToDeleteId: NaN,
  errors: {
    fetching: [],
    deleting: []
  }
};

export function getAdminTableReducer(prefix) {
  return createReducer({
    [prefix + FETCH]: (state, action) => merge(state, {
      isLoading: true
    }),
    [prefix + FETCH_SUCCESS]: (state, action) => merge(state, {
      isLoading: false,
      models: action.models
    }),
    [prefix + FETCH_FAILURE]: (state, action) => merge(state, {
      isLoading: false,
      errors: merge(state.errors, action.errors)
    }),
    [prefix + DELETE]: (state, action) => merge(state, {
      isLoading: true
    }),
    [prefix + DELETE_SUCCESS]: (state, action) => merge(state, {
      isLoading: false,
      models: state.models.filter((model) => model.id !== action.modelId)
    }),
    [prefix + DELETE_FAILURE]: (state, action) => merge(state, {
      isLoading: false,
      errors: merge(state.errors, action.errors)
    }),
    [prefix + SHOW_DELETE_MODAL]: (state, action) => merge(state, {
      modelToDeleteId: action.modelToDeleteId
    }),
    [prefix + HIDE_DELETE_MODAL]: (state, action) => merge(state, {
      modelToDeleteId: NaN
    })
  }, INITIAL_STATE);
}
