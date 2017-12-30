import { AnyAction, Store } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { get, put, remove } from '../../../../api';
import { RootState } from '../../../../rootReducer';
import { Observable } from 'rxjs/Observable';
import {
  DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS, EDIT_USER, EDIT_USER_FAILURE, EDIT_USER_SUCCESS, FETCH_USERS,
  FETCH_USERS_FAILURE,
  FETCH_USERS_SUCCESS
} from './actions';
import urls from '../../../../urls';
import { DataPayload } from '../../../../typings/api';

function fetchUsersEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(FETCH_USERS)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(get(urls.users))
          .map((payload: DataPayload) => ({type: FETCH_USERS_SUCCESS, users: payload.data}))
          .catch(errors => Observable.of({type: FETCH_USERS_FAILURE, errors}));
      }
    );
}

function deleteUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(DELETE_USER)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(remove(`${urls.users}/${action.payload.userId}`))
          .map((payload: DataPayload) => ({type: DELETE_USER_SUCCESS}))
          .catch(errors => Observable.of({type: DELETE_USER_FAILURE, errors}));
      }
    );
}

function editUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(EDIT_USER)
    .mergeMap((action: AnyAction) => {
        const {userId, ...userData} = action.payload;
        return Observable.fromPromise(put(`${urls.users}/${userId}`, userData))
          .map((payload: DataPayload) => ({type: EDIT_USER_SUCCESS, user: payload.data}))
          .catch(errors => Observable.of({type: EDIT_USER_FAILURE, errors}));
      }
    );
}

export default [fetchUsersEpic, deleteUserEpic, editUserEpic];