import { post } from '../../api';
import { SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS } from './actions';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../rootReducer';
import urls from '../../urls';

function submitEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(SUBMIT)
    .mergeMap((action: AnyAction) => {
        const {email, password} = store.getState().login.toJS();
        return Observable.fromPromise(post(urls.login, {email, password}))
          .map(payload => ({type: SUBMIT_SUCCESS, payload}))
          .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
      }
    );
}

export default [submitEpic];