import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';

const logger = createLogger({
  level: 'info',
  duration: true,
  collapsed: true
});

const router = routerMiddleware(browserHistory);
const enhancer = applyMiddleware(thunk, router, logger);

function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}

export default configureStore;