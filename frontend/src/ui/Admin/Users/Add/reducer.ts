import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { Group } from '../../../../typings/api-models';
import {
  ADD_USER, ADD_USER_FAILURE, ADD_USER_SUCCESS, FETCH_GROUPS, FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_SUCCESS
} from './actions';


export interface AddUserState {
  name: string;
  email: string;
  password: string;
  group?: Group;
  isLoading: boolean;
  groups: Array<Group>;
  errors: {
    addUser?: Array<string>;
    fetchGroups?: Array<string>;
  };
}

export const initialState: AddUserState = {
  name: '',
  email: '',
  password: '',
  group: undefined,
  isLoading: false,
  groups: [],
  errors: {}
};

export default createReducer({
  [FETCH_GROUPS]: (state, action) => state.merge({
    isLoading: true,
    errors: {
      fetchGroups: undefined
    }
  }),
  [FETCH_GROUPS_SUCCESS]: (state, action) => state.merge({
    isLoading: false, groups: action.groups
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
  })
}, ImmutableMap(initialState));