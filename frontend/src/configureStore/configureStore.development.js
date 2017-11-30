import {applyMiddleware, compose, createStore} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createEpicMiddleware} from 'redux-observable';
import {browserHistory} from 'react-router';
import rootReducer from "../rootReducer";
import rootEpic from "../rootEpic";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const epicMiddleware = createEpicMiddleware(rootEpic);
const enhancer = composeEnhancers(applyMiddleware(epicMiddleware, routerMiddleware(browserHistory)));

export default function configureStore() {
  const store = createStore(rootReducer, enhancer);
  if (module.hot) {
    module.hot.accept('../rootReducer', () =>
      store.replaceReducer(rootReducer)
    );
  }
  return store;
}