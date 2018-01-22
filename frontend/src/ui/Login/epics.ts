import { SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS } from './actions';
import { Observable } from 'rxjs/Observable';
import { ActionsObservable } from 'redux-observable';
import { AnyAction, Store } from 'redux';
import { RootState } from '../../rootReducer';
import urls from '../../urls';
import { push } from 'react-router-redux';
import { LOG_IN } from '../App/actions';
import { ApiService } from '../../services/api';

function submitEpic(action$: ActionsObservable<AnyAction>, store: Store<RootState>,
                    {apiService}: { apiService: ApiService }) {
  return action$.ofType(SUBMIT)
    .mergeMap((action: AnyAction) => {
        const {email, password} = store.getState().login.toJS();
        return Observable.fromPromise(apiService.postJSON(urls.login, {email, password}))
          .flatMap((payload: { refresh_token: string, access_token: string }) => {
            console.log(payload);
            localStorage.setItem('refresh_token', payload.refresh_token);
            localStorage.setItem('access_token', payload.access_token);
            return Observable.concat(
              Observable.of({type: SUBMIT_SUCCESS}),
              Observable.of({type: LOG_IN}),
              Observable.of(push('/')),
            );
          })
          .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
      }
    );
}

export default [submitEpic];