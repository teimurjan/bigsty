import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddUserComponent, { AddUserProps } from './AddUser';
import withIntl from '../../../../stories/withIntl';
import { Map as ImmutableMap } from 'immutable';
import { initialState } from './reducer';
import { reduxAction } from '../../../../stories/utils';
import { ADD_USER, CHANGE_EMAIL, CHANGE_GROUP, CHANGE_NAME, CHANGE_PASSWORD, CLOSE, FETCH_GROUPS } from './actions';

const initialProps: AddUserProps = {
  ...initialState, isOpen: true,
  actions: {
    fetchGroups: reduxAction(FETCH_GROUPS),
    addUser: reduxAction(ADD_USER),
    changeName: reduxAction(CHANGE_NAME),
    changePassword: reduxAction(CHANGE_PASSWORD),
    changeGroup: reduxAction(CHANGE_GROUP),
    changeEmail: reduxAction(CHANGE_EMAIL),
    close: reduxAction(CLOSE),
  }
};
const AddUser = withIntl(AddUserComponent);
const immutableProps = ImmutableMap(initialProps);
storiesOf('Add User', module)
  .add('Initial state', () => <AddUser {...initialProps}/>)
  .add('With content', () => {
    const chosenGroup = {name: 'admin'};
    return (
      <AddUser {...immutableProps.merge({
        groups: [chosenGroup, {name: 'reader'}, {name: 'manager'}], group: chosenGroup,
        name: 'Test name', email: 'Test email', password: 'passw0rd'
      }).toJS()}/>);
  })
  .add('With fetch groups error', () => (
      <AddUser {...immutableProps.set('errors', {fetchGroups: 'Some errors'}).toJS()}/>
    )
  );