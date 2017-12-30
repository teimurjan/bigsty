import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddUser from './AddUser';
import WithIntl from '../../../Common/WithIntl';
import { Map as ImmutableMap } from 'immutable';
import { AddUserState, initialState } from './reducer';
import { action } from '@storybook/addon-actions';

interface AddUserTestProps extends AddUserState {
  isOpen: boolean;
  actions: {
    fetchGroups: Function;
    addUser: Function;
  };
}

const initialProps: AddUserTestProps = {
  ...initialState, isOpen: true,
  actions: {
    fetchGroups: action('Fetched users'),
    addUser: action('User added')
  }
};
const immutableProps = ImmutableMap(initialProps);
const AddUserWithIntl: React.SFC<AddUserTestProps> = WithIntl(AddUser);
storiesOf('Add User', module)
  .add('Initial state', () => <AddUserWithIntl {...initialProps}/>)
  .add('With content', () => {
    const chosenGroup = {name: 'admin'};
    return (
      <AddUserWithIntl {...immutableProps.merge({
        groups: [chosenGroup, {name: 'reader'}, {name: 'manager'}], group: chosenGroup,
        name: 'Test name', email: 'Test email', password: 'passw0rd'
      }).toJS()}/>);
  });