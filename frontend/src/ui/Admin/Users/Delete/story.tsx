import * as React from 'react';
import { storiesOf } from '@storybook/react';
import withIntl from '../../../../stories/withIntl';
import { Map as ImmutableMap } from 'immutable';
import { initialState } from './reducer';
import { reduxAction } from '../../../../stories/utils';
import { default as DeleteUserComponent, DeleteUserProps } from './DeleteUser';
import { CLOSE, DELETE_USER } from './actions';

const initialProps: DeleteUserProps = {
  ...initialState,
  isOpen: false,
  actions: {
    deleteUser: reduxAction(DELETE_USER),
    close: reduxAction(CLOSE),
  }
};
const DeleteUser = withIntl(DeleteUserComponent);
const immutableProps = ImmutableMap(initialProps);
storiesOf('Delete User', module)
  .add('Open', () => <DeleteUser {...immutableProps.set('isOpen', true).toJS()}/>)
  .add('Loading', () => <DeleteUser {...immutableProps.merge({isOpen: true, isLoading: true}).toJS()}/>)
  .add('With error', () => <DeleteUser {...immutableProps.merge({isOpen: true, errors: ['anything']}).toJS()}/>);