import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Login from './Login';
import { initialState, LoginState } from './reducer';
import WithIntl from '../Common/WithIntl';
import { Map as ImmutableMap } from 'immutable';

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

const immutableProps = ImmutableMap(initialProps);

const LoginWithIntl: React.SFC<LoginTestProps> = WithIntl(Login);

storiesOf('Login', module)
  .add('Initial state', () => <LoginWithIntl {...initialProps} />)
  .add('With content', () => {
    const newProps = immutableProps.merge({
      email: 'test@email.com',
      password: 'Passw0rd'
    });
    return <LoginWithIntl {...newProps.toJS()} />;
  })
  .add('Loading', () => {
    const newProps = immutableProps.merge({
      isLoading: true
    });
    return <LoginWithIntl {...newProps.toJS()} />;
  })
  .add('With empty errors', () => {
    const newProps = immutableProps.merge({
      errors: {
        email: ['errors.login.email.mustNotBeEmpty'],
        password: ['errors.login.password.mustNotBeEmpty']
      }
    });
    return <LoginWithIntl {...newProps.toJS()} />;
  })
  .add('With auth errors', () => {
    const newProps = immutableProps.merge({
      errors: {
        auth: ['errors.login.invalidEmailOrPassword'],
      }
    });
    return <LoginWithIntl {...newProps.toJS()} />;
  });
