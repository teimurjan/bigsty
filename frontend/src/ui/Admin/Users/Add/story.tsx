import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AddUser, { AddUserProps } from './AddUser';
import WithIntl from '../../../Common/WithIntl';
import { Map as ImmutableMap } from 'immutable';
import { initialState } from './reducer';

const initialProps: AddUserProps = {...initialState, isOpen: true};
const immutableProps = ImmutableMap(initialProps);
const AddUserWithIntl: React.SFC<AddUserProps> = WithIntl(AddUser);
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