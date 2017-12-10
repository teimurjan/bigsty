import { User } from '../../../../types/models';
import createReducer from '../../../../createReducer';
import { Map } from 'immutable';

export interface UsersIndexState {
  users: Array<User>;
  isLoading: boolean;
}

export const initialState: UsersIndexState = {
  users: [],
  isLoading: false
};

export default createReducer({}, Map(initialState));