import { AnyAction, Store } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { RootState } from '../../../../rootReducer';
import { Observable } from 'rxjs/Observable';
import {
  EDIT_USER, EDIT_USER_FAILURE, EDIT_USER_SUCCESS, FETCH_USERS,
  FETCH_USERS_FAILURE,
  FETCH_USERS_SUCCESS
} from './actions';
import urls from '../../../../urls';
import { DataPayload } from '../../../../typings/api';
import { ApiService } from '../../../../services/api';

function fetchUsersEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                        {apiService}: { apiService: ApiService }) {
  return action$.ofType(FETCH_USERS)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(apiService.getJSON(urls.users))
          .map((payload: DataPayload) => ({type: FETCH_USERS_SUCCESS, payload: {users: payload.data}}))
          .catch(errors => Observable.of({type: FETCH_USERS_FAILURE, errors}));
      }
    );
}

function editUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                      {apiService}: { apiService: ApiService }) {
  return action$.ofType(EDIT_USER)
    .mergeMap((action: AnyAction) => {
        const {userId, ...userData} = action.payload;
        return Observable.fromPromise(apiService.putJSON(`${urls.users}/${userId}`, userData))
          .map((payload: DataPayload) => ({type: EDIT_USER_SUCCESS, payload: {user: payload.data}}))
          .catch(errors => Observable.of({type: EDIT_USER_FAILURE, errors}));
      }
    );
}

export default [fetchUsersEpic, editUserEpic];