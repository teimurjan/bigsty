import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore  from './store';
import { browserHistory } from 'react-router';
import Root from './containers/Root';
import { syncHistoryWithStore } from 'react-router-redux';
import {loadAuth} from "./actions/login";

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(loadAuth());

ReactDOM.render(
  <AppContainer>
    <Root store={store} history={history}/>
  </AppContainer>,
  document.getElementById('root')
);

if(module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;
    ReactDOM.render(
      <AppContainer>
        <NewRoot store={store} history={history}/>
      </AppContainer>,
      document.getElementById('root')
    )
  })
}