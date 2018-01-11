import { applyMiddleware, compose, createStore, Reducer } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import { browserHistory } from 'react-router';
import rootEpic from '../rootEpic';
import { RootState } from '../rootReducer';
import { makeApiService } from '../api';

export default function (rootReducer: Reducer<RootState>) {
  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies: {apiService: makeApiService()}
  });
  const enhancer = compose(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory)));
  return createStore(rootReducer, enhancer);
}