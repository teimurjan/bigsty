import { LOG_OUT } from './actions';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../rootReducer';
import { push } from 'react-router-redux';

function logOutEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(LOG_OUT).mapTo(push('/login'));
}

export default [logOutEpic];