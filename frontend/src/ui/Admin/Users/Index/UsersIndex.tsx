import * as React from 'react';
import { UsersIndexState } from './UsersIndexReducer';
import { ActionCreator } from 'redux';
import { UsersIndexActionType } from './UsersIndexActions';
import { default as InjectIntl, IntlProps } from '../../../Common/InjectIntl';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { DangerButton, PrimaryButton } from '../../../Common/Buttons/Buttons';
import { ButtonEvent } from '../../../../types/html';
import { User } from '../../../../types/models';

interface UsersIndexProps extends UsersIndexState, IntlProps {
  actions: {
    fetchUsers: ActionCreator<UsersIndexActionType>;
    deleteUser: ActionCreator<UsersIndexActionType>;
  };
}

export default InjectIntl(class extends React.Component<UsersIndexProps> {
  componentWillMount() {
    this.props.actions.fetchUsers();
  }

  actionsColumnFormatter = (cell: {}, user: User) => {
    const onDelete = (e: ButtonEvent) => {
      e.preventDefault();
      this.props.actions.deleteUser(user.id);
    };
    return (
      <div>
        <PrimaryButton className="col-md-6">
          {this.props.intl('admin.usersIndex.table.columns.actions.edit')}
        </PrimaryButton>
        <DangerButton className="col-md-6" onClick={onDelete}>
          {this.props.intl('admin.usersIndex.table.columns.actions.delete')}
        </DangerButton>
      </div>
    );
  };

  public render() {
    const {users, intl} = this.props;
    return (
      <BootstrapTable data={users} options={{noDataText: intl('admin.usersIndex.table.text.noData')}}>
        <TableHeaderColumn isKey dataField="id">{intl('admin.usersIndex.table.columns.id')}</TableHeaderColumn>
        <TableHeaderColumn dataField="name">{intl('admin.usersIndex.table.columns.name')}</TableHeaderColumn>
        <TableHeaderColumn dataField="email">{intl('admin.usersIndex.table.columns.email')}</TableHeaderColumn>
        <TableHeaderColumn dataField="group">{intl('admin.usersIndex.table.columns.group')}</TableHeaderColumn>
        <TableHeaderColumn dataField="is_active">{intl('admin.usersIndex.table.columns.isActive')}</TableHeaderColumn>
        <TableHeaderColumn dataField="date_joined">
          {intl('admin.usersIndex.table.columns.dateJoined')}
        </TableHeaderColumn>
        <TableHeaderColumn dataFormat={this.actionsColumnFormatter}/>
      </BootstrapTable>
    );
  }
});