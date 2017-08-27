import createReducer from './create-reducer';
import merge from 'xtend';
import {
  DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, FETCH_USERS, FETCH_USERS_FAILURE,
  FETCH_USERS_SUCCESS, HIDE_DELETE_MODAL, SHOW_DELETE_MODAL
} from "../actions/admin-users";

const INITIAL_STATE = {
  users: [],
  isLoading: false,
  userToDeleteId: NaN,
  errors: {
    fetching: [],
    deleting: []
  }
};

export default createReducer({
  [FETCH_USERS]: (state, action) => merge(state, {
    isLoading: true
  }),
  [FETCH_USERS_SUCCESS]: (state, action) => merge(state, {
    isLoading: false,
    users: action.users
  }),
  [FETCH_USERS_FAILURE]: (state, action) => merge(state, {
    isLoading: false,
    errors: merge(state.errors, {
      fetching: {
        $push: ['An error occured when getting users']
      }
    })
  }),
  [DELETE_USER]: (state, action) => merge(state, {
    isLoading: true
  }),
  [DELETE_USER_SUCCESS]: (state, action) => merge(state, {
    isLoading: false,
    users: state.users.filter((user) => user.id !== action.userId)
  }),
  [DELETE_USER_FAILURE]: (state, action) => merge(state, {
    isLoading: false,
    errors: merge(state.errors, {
      deleting: {
        $push: ['An error occured when deleting the user']
      }
    })
  }),
  [SHOW_DELETE_MODAL]: (state, action) => merge(state, {
    userToDeleteId: action.userToDeleteId
  }),
  [HIDE_DELETE_MODAL]: (state, action) => merge(state, {
    userToDeleteId: NaN
  })
}, INITIAL_STATE);
