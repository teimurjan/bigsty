import React from 'react';
import {Provider} from 'react-redux';
import {Router} from 'react-router';
import routes from '../routes';
import {IntlProvider} from "react-intl-redux";

class Root extends React.Component {
  render() {
    const {store, history} = this.props;

    return (
      <Provider store={store}>
        <IntlProvider>
          <Router history={history} routes={routes}/>
        </IntlProvider>
      </Provider>
    )
  }
}

export default Root;