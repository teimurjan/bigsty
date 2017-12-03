import {post} from "../../api";
import {SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS} from "./RegistrationActions";
import 'rxjs';
import {Observable} from "rxjs/Observable";

export function submitEpic(action$, store) {
  return action$.ofType(SUBMIT)
  .mergeMap(action => {
      const {name, email, password} = store.getState().registration.toJS();
      return Observable.fromPromise(post('/api/register', {name, email, password}))
      .map(payload => ({type: SUBMIT_SUCCESS, payload}))
      .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
    }
  )
}