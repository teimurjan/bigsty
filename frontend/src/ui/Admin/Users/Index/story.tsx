import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import UsersIndex from './UsersIndex';
import { UsersIndexState, initialState } from './reducer';
import WithIntl from '../../../Common/WithIntl';

interface UsersIndexTestProps extends UsersIndexState {
  actions: {
    fetchUsers: Function
  };
}

const initialProps: UsersIndexTestProps = {
  ...initialState,
  actions: {
    fetchUsers: action('Fetched users'),
  }
};

const UsersIndexWithIntl: React.SFC<UsersIndexTestProps> = WithIntl(UsersIndex);

storiesOf('Users Index', module)
  .add('Initial state', () => <UsersIndexWithIntl {...initialProps}/>)
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
    return <UsersIndexWithIntl {...newProps}/>;
  });
