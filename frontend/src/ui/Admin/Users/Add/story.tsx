import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddUserComponent, { AddUserProps } from './AddUser';
import withIntl from '../../../../stories/withIntl';
import { Map as ImmutableMap } from 'immutable';
import { initialState } from './reducer';
import { reduxAction } from '../../../../stories/utils';
import { ADD_USER, FETCH_GROUPS } from './actions';
import { action as getStoryAction } from '@storybook/addon-actions';

const initialProps: AddUserProps = {
  ...initialState, isOpen: true,
  onClose: getStoryAction('Closed'),
  actions: {
    fetchGroups: reduxAction(FETCH_GROUPS),
    addUser: reduxAction(ADD_USER)
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