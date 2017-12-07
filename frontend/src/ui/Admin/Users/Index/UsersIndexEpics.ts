import { AnyAction, Store } from 'redux';
import { ActionsObservable } from 'redux-observable';
import { get } from '../../../../api';
import { RootState } from '../../../../rootReducer';
import { Observable } from 'rxjs/Observable';
import { FETCH_USERS, FETCH_USERS_FAILURE, FETCH_USERS_SUCCESS } from './UsersIndexActions';
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

export default [fetchUsersEpic];