import {post} from "../../api";
import {SUBMIT, SUBMIT_FAILURE, SUBMIT_SUCCESS} from "./LoginActions";
import 'rxjs';
import {Observable} from "rxjs/Observable";
import {Epic} from "redux-observable";
import {AnyAction, Store} from "redux";
import {RootState} from "../../rootReducer";

export function submitEpic(action$: AnyAction, store: Store<RootState>): Epic<AnyAction, RootState> {
  return action$.ofType(SUBMIT)
    .mergeMap((action: AnyAction) => {
        const {email, password} = store.getState().login.toJS();
        return Observable.fromPromise(post('/api/login', {email, password}))
          .map(payload => ({type: SUBMIT_SUCCESS, payload}))
          .catch(errors => Observable.of({type: SUBMIT_FAILURE, errors}));
      }
    )
}