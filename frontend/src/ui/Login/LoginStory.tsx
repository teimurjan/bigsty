import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Login from './Login';
import { initialState, LoginState } from './LoginReducer';
import WithIntl from '../Common/WithIntl';

interface LoginTestProps extends LoginState {
  actions: {
    changeEmail: Function,
    changePassword: Function,
    submit: Function
  };
}

const initialProps: LoginTestProps = {
  ...initialState,
  actions: {
    changeEmail: action('Email changed'),
    changePassword: action('Password changed'),
    submit: action('Submitted')
  }
};
const LoginWithIntl: React.SFC<LoginTestProps> = WithIntl(Login);

storiesOf('Login', module)
  .add('Initial state', () => <LoginWithIntl {...initialProps} />)
  .add('With content', () => {
    const newProps = Object.assign({}, initialProps, {
      email: 'test@email.com',
      password: 'Passw0rd'
    });
    return <LoginWithIntl {...newProps} />;
  })
  .add('Loading', () => {
    const newProps = Object.assign({}, initialProps, {
      isLoading: true
    });
    return <LoginWithIntl {...newProps} />;
  })
  .add('With empty errors', () => {
    const newProps = Object.assign({}, initialProps, {
      errors: {
        email: ['errors.login.email.mustNotBeEmpty'],
        password: ['errors.login.password.mustNotBeEmpty']
      }
    });
    return <LoginWithIntl {...newProps} />;
  })
  .add('With auth errors', () => {
    const newProps = Object.assign({}, initialProps, {
      errors: {
        auth: ['errors.login.invalidEmailOrPassword'],
      }
    });
    return <LoginWithIntl {...newProps} />;
  });
