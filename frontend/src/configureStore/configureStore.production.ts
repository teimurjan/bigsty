import { applyMiddleware, compose, createStore, Reducer } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import { browserHistory } from 'react-router';
import rootEpic from '../rootEpic';
import { RootState } from '../rootReducer';
import ApiService from '../services/api';
import AuthService from '../services/auth';

export default function (rootReducer: Reducer<RootState>) {
  const apiService = new ApiService();
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {apiService}
  });
  const enhancer = compose(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory)));
  const store = createStore(rootReducer, enhancer);

  const authService = new AuthService(store.dispatch);
  apiService.setAuthService(authService);

  return store;
}