import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import { Group } from '../../../../typings/api-models';

export interface AddUserState {
  name: string;
  email: string;
  password: string;
  group?: Group;
  isLoading: boolean;
  groups: Array<Group>;
}

export const initialState: AddUserState = {
  name: '',
  email: '',
  password: '',
  group: undefined,
  isLoading: false,
  groups: []
};

export default createReducer({}, ImmutableMap(initialState));