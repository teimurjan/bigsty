import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { User } from '../../../../typings/api-models';

export interface UsersState {
  users: Array<User>;
  isLoading: boolean;
}

export const initialState: UsersState = {
  users: [],
  isLoading: false
};

export default createReducer({}, ImmutableMap(initialState));