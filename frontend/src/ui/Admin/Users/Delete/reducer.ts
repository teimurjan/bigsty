import createReducer from '../../../../createReducer';
import { Map as ImmutableMap } from 'immutable';
import {
  DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, OPEN, CLOSE
} from './actions';

export interface DeleteUserState {
  userId?: number;
  isLoading: boolean;
  errors?: Array<string>;
}

export const initialState: DeleteUserState = {
  isLoading: false,
  errors: undefined,
  userId: undefined
};

const immutableState = ImmutableMap(initialState);
export default createReducer({
  [OPEN]: (state, action) => state.set('userId', action.payload.userId),
  [CLOSE]: (state, action) => immutableState,
  [DELETE_USER]: (state, action) => state.merge({
    isLoading: true, errors: undefined
  }),
  [DELETE_USER_SUCCESS]: (state, action) => state.set('isLoading', false),
  [DELETE_USER_FAILURE]: (state, action) => state.merge({
    isLoading: false, errors: action.errors
  }),
}, immutableState);