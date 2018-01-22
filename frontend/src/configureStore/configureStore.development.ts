import { applyMiddleware, compose, createStore, Reducer } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import { browserHistory } from 'react-router';
import rootEpic from '../rootEpic';
import { RootState } from '../rootReducer';
import ApiService from '../services/api';
import AuthService from '../services/auth';

interface WindowWithReduxDevTools extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
}

export default function (rootReducer: Reducer<RootState>) {
  const windowWithReduxDevTools = window as WindowWithReduxDevTools;
  const composeEnhancers = windowWithReduxDevTools.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const apiService = new ApiService();
  const epicMiddleware = createEpicMiddleware(rootEpic, {dependencies: {apiService}});
  const enhancer = composeEnhancers(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory)));
  const store = createStore(rootReducer, enhancer);

  const authService = new AuthService(store.dispatch);
  apiService.setAuthService(authService);

  if (module.hot) {
    module.hot.accept('../rootReducer', () => store.replaceReducer(rootReducer));
  }
  return store;
}