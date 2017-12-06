import { post } from '../../api';
import { SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS } from './RegistrationActions';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../rootReducer';

export function submitEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>) {
  return action$.ofType(SUBMIT)
    .mergeMap((action: AnyAction) => {
        const {name, email, password} = store.getState().registration.toJS();
        return Observable.fromPromise(post('/api/register', {name, email, password}))
          .map(payload => ({type: SUBMIT_SUCCESS, payload}))
          .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
      }
    );
}