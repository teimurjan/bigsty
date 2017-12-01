import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Login from "./Login";
import {INITIAL_STATE} from "./LoginReducer";
import {IntlProvider} from "react-intl";

const props = {
  ...INITIAL_STATE.toJS(),
  actions: {
    changeEmail: action('Email changed'),
    changePassword: action('Password changed'),
    submit: action('Submitted')
  }
};
const messages = require(`../assets/translations/en.json`);
const LoginWithIntl = props => <IntlProvider locale='en' messages={messages}><Login {...props}/></IntlProvider>;

storiesOf('Login', module)
.add('Initial state', () => <LoginWithIntl {...props}/>)
.add('With content', () => {
  const newProps = Object.assign({}, props, {
    email: 'test@email.com',
    password: 'Passw0rd'
  });
  return <LoginWithIntl {...newProps}/>;
})
.add('Loading', () => {
  const newProps = Object.assign({}, props, {
    isLoading: true
  });
  return <LoginWithIntl {...newProps}/>;
})
.add('With empty errors', () => {
  const newProps = Object.assign({}, props, {
    errors: {
      email: 'errors.login.email.mustNotBeEmpty',
      password: 'errors.login.password.mustNotBeEmpty'
    }
  });
  return <LoginWithIntl {...newProps}/>;
})
.add('With auth errors', () => {
  const newProps = Object.assign({}, props, {
    errors: {
      auth: ['errors.login.auth.invalidEmailOrPassword'],
    }
  });
  return <LoginWithIntl {...newProps}/>;
});
