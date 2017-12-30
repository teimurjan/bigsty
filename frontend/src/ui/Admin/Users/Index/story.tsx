import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Users from './Users';
import { UsersState, initialState } from './reducer';
import WithIntl from '../../../Common/WithIntl';

interface UsersTestProps extends UsersState {
  actions: {
    fetchUsers: Function
  };
}

const initialProps: UsersTestProps = {
  ...initialState,
  actions: {
    fetchUsers: action('Fetched users'),
  }
};

const UsersWithIntl: React.SFC<UsersTestProps> = WithIntl(Users);

storiesOf('Admin Users', module)
  .add('Initial state', () => <UsersWithIntl {...initialProps}/>)
  .add('With content', () => {
    const newProps = Object.assign({}, initialProps, {
      users: [{
        id: 1,
        name: 'Ivan Pupkin',
        email: 'ivan_pupkin@gmail.com',
        is_active: 'True',
        date_joined: '25/06/2017',
        group: 'admin'
      }]
    });
    return <UsersWithIntl {...newProps}/>;
  });
