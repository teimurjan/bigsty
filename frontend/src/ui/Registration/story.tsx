import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Registration from './Registration';
import { initialState, RegistrationState } from './reducer';
import WithIntl from '../Common/WithIntl';
import { Map as ImmutableMap } from 'immutable';

interface RegistrationTestProps extends RegistrationState {
  actions: {
    changeName: Function,
    changeEmail: Function,
    changePassword: Function,
    submit: Function
  };
}

const initialProps: RegistrationTestProps = {
  ...initialState,
  actions: {
    changeName: action('Name changed'),
    changeEmail: action('Email changed'),
    changePassword: action('Password changed'),
    submit: action('Submitted')
  }
};

const immutableProps = ImmutableMap(initialProps);
const RegistrationWithIntl: React.SFC<RegistrationTestProps> = WithIntl(Registration);

storiesOf('Registration', module)
  .add('Initial state', () => <RegistrationWithIntl {...initialProps} />)
  .add('With content', () => {
    const newProps = immutableProps.merge({
      name: 'Test Name',
      email: 'test@email.com',
      password: 'Passw0rd'
    });
    return <RegistrationWithIntl {...newProps.toJS()} />;
  })
  .add('Loading', () => {
    const newProps = immutableProps.set('isLoading', true);
    return <RegistrationWithIntl {...newProps.toJS()} />;
  })
  .add('With empty errors', () => {
    const newProps = immutableProps.merge({
      errors: {
        name: ['errors.registration.name.mustNotBeEmpty'],
        email: ['errors.registration.email.mustNotBeEmpty'],
        password: ['errors.registration.password.mustNotBeEmpty']
      }
    });
    return <RegistrationWithIntl {...newProps.toJS()} />;
  });