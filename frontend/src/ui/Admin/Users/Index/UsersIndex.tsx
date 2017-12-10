import * as React from 'react';
import { UsersIndexState } from './UsersIndexReducer';
import { ActionCreator } from 'redux';
import { UsersIndexActionType } from './UsersIndexActions';
import { IntlProps } from '../../../Common/InjectIntl';

interface UsersIndexProps extends UsersIndexState {
  actions: {
    fetchUsers: ActionCreator<UsersIndexActionType>;
  };
}

export default class UsersIndex extends React.Component<UsersIndexProps & IntlProps> {
  componentWillMount(){
    this.props.actions.fetchUsers();
  }

  public render() {
    return false;
  }
}