import * as React from 'react';
import { UsersIndexState } from './UsersIndexReducer';
import { UsersIndexActionCreatorsMapObject } from './UsersIndexActions';
import { default as InjectIntl, IntlProps } from '../../../Common/InjectIntl';
import { TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import AdminModelTable from '../../Common/AdminModelTable';

interface UsersIndexProps extends UsersIndexState, IntlProps {
  actions: UsersIndexActionCreatorsMapObject;
}

export default InjectIntl(class extends React.Component<UsersIndexProps> {
  componentWillMount() {
    this.props.actions.fetchUsers();
  }

  public render() {
    const {users, intl} = this.props;
    // TODO Replace stub methods
    const stubMethod = () => false;
    return (
      <AdminModelTable data={users} options={{noDataText: intl('admin.usersIndex.table.text.noData')}}
                       onEdit={stubMethod} onAdd={stubMethod} onDelete={stubMethod}>
        <TableHeaderColumn isKey dataField="id">{intl('admin.usersIndex.table.columns.id')}</TableHeaderColumn>
        <TableHeaderColumn dataField="name">{intl('admin.usersIndex.table.columns.name')}</TableHeaderColumn>
        <TableHeaderColumn dataField="email">{intl('admin.usersIndex.table.columns.email')}</TableHeaderColumn>
        <TableHeaderColumn dataField="group">{intl('admin.usersIndex.table.columns.group')}</TableHeaderColumn>
        <TableHeaderColumn dataField="is_active">{intl('admin.usersIndex.table.columns.isActive')}</TableHeaderColumn>
        <TableHeaderColumn dataField="date_joined">
          {intl('admin.usersIndex.table.columns.dateJoined')}
        </TableHeaderColumn>
      </AdminModelTable>
    );
  }
});