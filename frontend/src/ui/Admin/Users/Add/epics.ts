import { ActionsObservable } from 'redux-observable';
import { RootState } from '../../../../rootReducer';
import { DataPayload } from '../../../../typings/api';
import { get, post } from '../../../../api';
import {
  ADD_USER, ADD_USER_FAILURE, ADD_USER_SUCCESS, CLOSE_MODAL, FETCH_GROUPS, FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_SUCCESS
} from './actions';
import { Observable } from 'rxjs/Observable';
import { AnyAction, Store } from 'redux';
import urls from '../../../../urls';
import { FETCH_USERS } from '../Index/actions';

function addUserEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(ADD_USER)
    .mergeMap((action: AnyAction) => {
        const {name, email, password, group = {name: undefined}} = store.getState().adminAddUser.toJS();
        return Observable.fromPromise(post(urls.users, {name, email, password, group: group.name}))
          .flatMap((payload: DataPayload) => Observable.merge(
            Observable.of({type: ADD_USER_SUCCESS, user: payload.data}),
            Observable.of({type: FETCH_USERS}),
            Observable.of({type: CLOSE_MODAL})
          ))
          .catch(errors => Observable.of({type: ADD_USER_FAILURE, errors}));
      }
    );
}

function fetchGroupsEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(FETCH_GROUPS)
    .mergeMap((action: AnyAction) => {
        return Observable.fromPromise(get(`${urls.groups}?exclude=["users"]`))
          .map((payload: DataPayload) => ({type: FETCH_GROUPS_SUCCESS, groups: payload.data}))
          .catch(errors => Observable.of({type: FETCH_GROUPS_FAILURE, errors}));
      }
    );
}

export default [addUserEpic, fetchGroupsEpic];