import { ActionsObservable } from 'redux-observable';
import { RootState } from '../../../../rootReducer';
import { DataPayload } from '../../../../typings/api';
import {
  ADD_USER, ADD_USER_FAILURE, ADD_USER_SUCCESS, CLOSE, FETCH_GROUPS, FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_SUCCESS
} from './actions';
import { Observable } from 'rxjs/Observable';
import { AnyAction, Store } from 'redux';
import urls from '../../../../urls';
import { ApiService } from '../../../../services/api';

function addUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                     {apiService}: { apiService: ApiService }) {
  return action$.ofType(ADD_USER)
    .mergeMap((action: AnyAction) => {
        const {name, email, password, group = {name: undefined}} = store.getState().adminAddUser.toJS();
        const requestPayload = {name, email, password, group: group.name};
        return Observable.fromPromise(apiService.postJSON(urls.users, requestPayload))
          .flatMap((payload: DataPayload) => Observable.concat(
            Observable.of({type: ADD_USER_SUCCESS, payload: {user: payload.data}}),
            Observable.of({type: CLOSE})
          ))
          .catch(errors => Observable.of({type: ADD_USER_FAILURE, errors}));
      }
    );
}

function fetchGroupsEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                         {apiService}: { apiService: ApiService }) {
  return action$.ofType(FETCH_GROUPS)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(apiService.getJSON(`${urls.groups}?exclude=["users"]`))
          .map((payload: DataPayload) => ({type: FETCH_GROUPS_SUCCESS, payload: {groups: payload.data}}))
          .catch(errors => Observable.of({type: FETCH_GROUPS_FAILURE, errors}));
      }
    );
}

export default [addUserEpic, fetchGroupsEpic];