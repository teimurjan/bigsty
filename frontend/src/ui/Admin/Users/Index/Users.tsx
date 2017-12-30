import * as React from 'react';
import { UsersState } from './reducer';
import { UsersActionCreatorsMapObject } from './actions';
import { default as InjectIntl, IntlProps } from '../../../Common/InjectIntl';
import { TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import AdminModelTable from '../../Common/AdminModelTable';

interface UsersProps extends UsersState, IntlProps {
  actions: UsersActionCreatorsMapObject;
}

export default InjectIntl(class extends React.Component<UsersProps> {
  componentWillMount() {
    this.props.actions.fetchUsers();
  }

  public render() {
    const {users, intl} = this.props;
    // TODO Replace stub methods
    const stubMethod = () => false;
    return (
      <AdminModelTable data={users} options={{noDataText: intl('admin.users.table.text.noData')}}
                       onEdit={stubMethod} onAdd={stubMethod} onDelete={stubMethod}>
        <TableHeaderColumn isKey dataField="id">{intl('admin.users.table.columns.id')}</TableHeaderColumn>
        <TableHeaderColumn dataField="name">{intl('admin.users.table.columns.name')}</TableHeaderColumn>
        <TableHeaderColumn dataField="email">{intl('admin.users.table.columns.email')}</TableHeaderColumn>
        <TableHeaderColumn dataField="group">{intl('admin.users.table.columns.group')}</TableHeaderColumn>
        <TableHeaderColumn dataField="is_active">{intl('admin.users.table.columns.isActive')}</TableHeaderColumn>
        <TableHeaderColumn dataField="date_joined">
          {intl('admin.users.table.columns.dateJoined')}
        </TableHeaderColumn>
      </AdminModelTable>
    );
  }
});