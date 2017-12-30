import * as React from 'react';
import { storiesOf } from '@storybook/react';

import RegistrationComponent, { RegistrationProps } from './Registration';
import { initialState } from './reducer';
import { Map as ImmutableMap } from 'immutable';
import { reduxAction } from '../../stories/utils';
import { CHANGE_NAME, CHANGE_EMAIL, CHANGE_PASSWORD, SUBMIT } from './actions';
import withIntl from '../../stories/withIntl';

const initialProps: RegistrationProps = {
  ...initialState,
  actions: {
    changeName: reduxAction(CHANGE_NAME),
    changeEmail: reduxAction(CHANGE_EMAIL),
    changePassword: reduxAction(CHANGE_PASSWORD),
    submit: reduxAction(SUBMIT)
  }
};

const immutableProps = ImmutableMap(initialProps);
const Registration = withIntl(RegistrationComponent);

storiesOf('Registration', module)
  .add('Initial state', () => <Registration {...initialProps} />)
  .add('With content', () => {
    const newProps = immutableProps.merge({
      name: 'Test Name',
      email: 'test@email.com',
      password: 'Passw0rd'
    });
    return <Registration {...newProps.toJS()} />;
  })
  .add('Loading', () => {
    const newProps = immutableProps.set('isLoading', true);
    return <Registration {...newProps.toJS()} />;
  })
  .add('With empty errors', () => {
    const newProps = immutableProps.merge({
      errors: {
        name: ['errors.registration.name.mustNotBeEmpty'],
        email: ['errors.registration.email.mustNotBeEmpty'],
        password: ['errors.registration.password.mustNotBeEmpty']
      }
    });
    return <Registration {...newProps.toJS()} />;
  });