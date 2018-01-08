import * as React from 'react';
import { UsersState } from './reducer';
import { UsersActionCreatorsMapObject } from './actions';
import { default as injectIntl, IntlProps } from '../../../Common/injectIntl';
import { TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import AdminModelTable from '../../Common/AdminModelTable';
import AddUser from '../Add/AddUserContainer';
import { AddUserModalActionCreatorsMapObject } from '../Add/actions';
import { ButtonEvent } from '../../../../typings/html-shortcuts';

export interface UsersProps extends UsersState {
  actions: UsersActionCreatorsMapObject & AddUserModalActionCreatorsMapObject;
}

export default injectIntl(class extends React.Component<UsersProps & IntlProps> {
  componentWillMount() {
    this.props.actions.fetchUsers();
  }

  onOpenAddUserModal = (e: ButtonEvent) => {
    e.preventDefault();
    this.props.actions.openAddUserModal();
  };

  onCloseAddUserModal = (e: ButtonEvent) => {
    e.preventDefault();
    this.props.actions.closeAddUserModal();
  };

  render() {
    const {users, intl} = this.props;
    // TODO Replace stub methods
    const stubMethod = () => false;
    return (
      <div id="adminUsers">
        <AdminModelTable data={users} options={{noDataText: intl('admin.users.table.text.noData')}}
                         onEdit={stubMethod} onAdd={this.onOpenAddUserModal} onDelete={stubMethod}>
          <TableHeaderColumn isKey dataField="id">{intl('admin.users.table.columns.id')}</TableHeaderColumn>
          <TableHeaderColumn dataField="name">{intl('admin.users.table.columns.name')}</TableHeaderColumn>
          <TableHeaderColumn dataField="email">{intl('admin.users.table.columns.email')}</TableHeaderColumn>
          <TableHeaderColumn dataField="group">{intl('admin.users.table.columns.group')}</TableHeaderColumn>
          <TableHeaderColumn dataField="is_active">{intl('admin.users.table.columns.isActive')}</TableHeaderColumn>
          <TableHeaderColumn dataField="date_joined">
            {intl('admin.users.table.columns.dateJoined')}
          </TableHeaderColumn>
        </AdminModelTable>
        <AddUser onClose={this.onCloseAddUserModal}/>
      </div>
    );
  }
});