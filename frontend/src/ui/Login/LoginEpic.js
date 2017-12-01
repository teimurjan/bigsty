import {post} from "../../api";
import {SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS} from "./LoginActions";
import 'rxjs';
import {Observable} from "rxjs/Observable";

export function submitEpic(action$, store) {
  return action$.ofType(SUBMIT)
  .mergeMap(action => {
      const {email, password} = store.getState().login.toJS();
      return Observable.fromPromise(post('/api/login', {email, password}))
      .map(payload => ({type: SUBMIT_SUCCESS, payload}))
      .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
    }
  )
}