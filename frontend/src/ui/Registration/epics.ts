import { SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS } from './actions';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../rootReducer';
import urls from '../../urls';
import { ApiService } from '../../typings/api';

function submitEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                    {apiService}: { apiService: ApiService }) {
  return action$.ofType(SUBMIT)
    .mergeMap((action: AnyAction) => {
        const {name, email, password} = store.getState().registration.toJS();
        return Observable.fromPromise(apiService.post(urls.register, {name, email, password}))
          .map(payload => ({type: SUBMIT_SUCCESS, payload}))
          .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
      }
    );
}

export default [submitEpic];