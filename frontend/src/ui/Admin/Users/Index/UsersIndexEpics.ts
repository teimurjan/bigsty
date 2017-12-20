import { AnyAction, Store } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { get, remove } from '../../../../api';
import { RootState } from '../../../../rootReducer';
import { Observable } from 'rxjs/Observable';
import {
  DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, FETCH_USERS, FETCH_USERS_FAILURE,
  FETCH_USERS_SUCCESS
} from './UsersIndexActions';
import { DataPayload } from '../../../../types/common';

function fetchUsersEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(FETCH_USERS)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(get('/api/users'))
          .map((payload: DataPayload) => ({type: FETCH_USERS_SUCCESS, users: payload.data}))
          .catch(errors => Observable.of({type: FETCH_USERS_FAILURE, errors}));
      }
    );
}

function deleteUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(DELETE_USER)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(remove(`/api/users/${action.payload.userId}`))
          .map((payload: DataPayload) => ({type: DELETE_USER_SUCCESS}))
          .catch(errors => Observable.of({type: DELETE_USER_FAILURE, errors}));
      }
    );
}

export default [fetchUsersEpic, deleteUserEpic];