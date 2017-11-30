import React from 'react';
import ReactDOM from 'react-dom';
import {syncHistoryWithStore} from 'react-router-redux';
import {browserHistory, Router} from 'react-router';
import rootReducer from "./rootReducer";
import {Provider} from 'react-redux';
import registerServiceWorker from "./registerServiceWorker";
import routes from "./routes";
import configureStore from "./configureStore";

const store = configureStore(rootReducer);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();