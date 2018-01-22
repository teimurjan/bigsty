import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { Group } from '../../../../typings/api-models';
import {
  ADD_USER, ADD_USER_FAILURE, ADD_USER_SUCCESS, CHANGE_EMAIL, CHANGE_GROUP, CHANGE_NAME, FETCH_GROUPS,
  FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_SUCCESS, CHANGE_PASSWORD, OPEN, CLOSE
} from './actions';

export interface AddUserState {
  isOpen: boolean;
  name: string;
  email: string;
  password: string;
  group?: Group;
  isLoading: boolean;
  groups: Array<Group>;
  errors: {
    addUser?: Map<string, Array<string>>;
    fetchGroups?: Array<string>;
  };
}

export const initialState: AddUserState = {
  isOpen: false,
  name: '',
  email: '',
  password: '',
  group: undefined,
  isLoading: false,
  groups: [],
  errors: {}
};

const immutableState = ImmutableMap(initialState);
export default createReducer({
  [OPEN]: (state, action) => state.set('isOpen', true),
  [CLOSE]: (state, action) => immutableState,
  [FETCH_GROUPS]: (state, action) => state.merge({
    isLoading: true,
    errors: {
      fetchGroups: undefined
    }
  }),
  [FETCH_GROUPS_SUCCESS]: (state, action) => state.merge({
    isLoading: false, groups: action.payload.groups
  }),
  [FETCH_GROUPS_FAILURE]: (state, action) => state.merge({
    isLoading: false,
    errors: {
      fetchGroups: action.errors
    }
  }),
  [ADD_USER]: (state, action) => state.merge({
    isLoading: true, errors: {
      addUser: undefined
    }
  }),
  [ADD_USER_SUCCESS]: (state, action) => state.set('isLoading', false),
  [ADD_USER_FAILURE]: (state, action) => state.merge({
    isLoading: false,
    errors: {
      addUser: action.errors
    }
  }),
  [CHANGE_NAME]: (state, action) => state.set('name', action.payload.name),
  [CHANGE_EMAIL]: (state, action) => state.set('email', action.payload.email),
  [CHANGE_GROUP]: (state, action) => state.set('group', action.payload.group),
  [CHANGE_PASSWORD]: (state, action) => state.set('password', action.payload.password),
}, immutableState);