import urls from '../../../../urls';
import { DataPayload } from '../../../../typings/api';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../../../../rootReducer';
import { DELETE_USER, DELETE_USER_FAILURE, DELETE_USER_SUCCESS } from './actions';
import { ApiService } from '../../../../services/api';
import { close } from './actions';

function deleteUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                        {apiService}: { apiService: ApiService }) {
  return action$.ofType(DELETE_USER)
    .mergeMap((action: AnyAction) => {
        const userId = store.getState().adminDeleteUser.get('userId');
        return Observable.fromPromise(apiService.removeJSON(`${urls.users}/${userId}`))
          .flatMap((payload: DataPayload) => Observable.concat(
            Observable.of({type: DELETE_USER_SUCCESS, payload: {userId}}),
            Observable.of(close()),
          ))
          .catch(errors => Observable.of({type: DELETE_USER_FAILURE, errors}));
      }
    );
}

export default [deleteUserEpic];