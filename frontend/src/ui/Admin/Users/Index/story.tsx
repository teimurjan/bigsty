import * as React from 'react';
import { storiesOf } from '@storybook/react';
import UsersComponent, { UsersProps } from './Users';
import { initialState } from './reducer';
import withIntl from '../../../../stories/withIntl';
import { Provider } from 'react-redux';
import configureStore from '../../../../configureStore';
import rootReducer from '../../../../rootReducer';
import { reduxAction } from '../../../../stories/utils';
import { FETCH_USERS } from './actions';
import withStore from '../../../../stories/withStore';
import { OPEN as OPEN_ADD_USER_MODAL } from '../Add/actions';
import { OPEN as OPEN_DELETE_USER_MODAL } from '../Delete/actions';

const initialProps: UsersProps = {
  ...initialState,
  actions: {
    fetchUsers: reduxAction(FETCH_USERS),
    openAddUserModal: reduxAction(OPEN_ADD_USER_MODAL),
    openDeleteUserModal: reduxAction(OPEN_DELETE_USER_MODAL),
  }
};

const store = configureStore(rootReducer);
const Users = withStore(withIntl(UsersComponent), store);

storiesOf('Admin Users', module)
  .addDecorator(getStory => <Provider store={store}>{getStory()}</Provider>)
  .add('Initial state', () => <Users {...initialProps}/>)
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
    return <Users {...newProps}/>;
  });
