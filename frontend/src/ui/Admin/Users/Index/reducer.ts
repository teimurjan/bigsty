import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { User } from '../../../../typings/api-models';
import { FETCH_USERS, FETCH_USERS_SUCCESS } from './actions';
import { FETCH_GROUPS_FAILURE } from '../Add/actions';

export interface UsersState {
  users: Array<User>;
  isLoading: boolean;
}

export const initialState: UsersState = {
  users: [],
  isLoading: false
};

export default createReducer({
  [FETCH_USERS]: (state, action) => state.set('isLoading', true),
  [FETCH_USERS_SUCCESS]: (state, action) => state.merge({
    isLoading: false, users: action.payload.users
  }),
  [FETCH_GROUPS_FAILURE]: (state, action) => state.merge({
    isLoading: false, errors: action.errors
  }),
}, ImmutableMap(initialState));