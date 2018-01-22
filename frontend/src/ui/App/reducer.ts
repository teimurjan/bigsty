import { Map as ImmutableMap } from 'immutable';
import createReducer from '../../createReducer';
import { LOG_IN, LOG_OUT } from './actions';

export interface AppState {
  isLoggedIn: boolean;
}

export const initialState: AppState = {
  isLoggedIn: false
};

export default createReducer({
  [LOG_IN]: (state, action) => state.set('isLoggedIn', true),
  [LOG_OUT]: (state, action) => state.set('isLoggedIn', false),
}, ImmutableMap(initialState));