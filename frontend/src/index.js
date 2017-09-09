import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import configureStore from './store';
import {browserHistory} from 'react-router';
import Root from './containers/Root';
import {syncHistoryWithStore} from 'react-router-redux';
import {loadAuth} from "./actions/login";
import {updateLocale} from "./actions/react-intl-helper";
import Perf from 'react-addons-perf';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(loadAuth());
store.dispatch(updateLocale());

const render = Component => {
  Perf.start();
  ReactDOM.render(
    <AppContainer>
      <Component store={store} history={history}/>
    </AppContainer>,
    document.getElementById('root')
  );
  Perf.stop();
  Perf.printWasted();
};

render(Root);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NewRoot = require('./containers/Root').default;
    render(NewRoot);
  })
}