import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { User } from '../../../../typings/api-models';
import { FETCH_USERS, FETCH_USERS_SUCCESS } from './actions';
import { ADD_USER_SUCCESS, FETCH_GROUPS_FAILURE } from '../Add/actions';
import { DELETE_USER_SUCCESS } from '../Delete/actions';

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
  [ADD_USER_SUCCESS]: (state, action) => {
    const users = state.get('users').push(ImmutableMap(action.payload.user));
    return state.set('users', users)
  },
  [DELETE_USER_SUCCESS]: (state, action) => {
    const isNotDeletedUser = (user: ImmutableMap<keyof User, {}>) => user.get('id') !== action.payload.userId;
    const users = state.get('users').filter(isNotDeletedUser);
    return state.set('users', users);
  }
}, ImmutableMap(initialState));