import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {getAdminTableActions} from '../../actions/admin/admin-table';
import IndexTable from "../../components/Admin/Common/AdminTable";

export const ADMIN_USERS_PREFIX = 'ADMIN_USERS/';

function mapStateToProps(state) {
  const intlPrefix = 'adminUsers';
  const colProps = [
    {dataField: 'id'},
    {dataSort: true, dataField: 'name'},
    {dataSort: true, dataField: 'email'},
    {dataSort: true, dataField: 'group'},
    {dataField: 'actions'}
  ];
  return {...state.adminUsers, intlPrefix, colProps}
}

function mapDispatchToProps(dispatch) {
  const url = '/api/users';
  return {
    actions: bindActionCreators(getAdminTableActions(ADMIN_USERS_PREFIX, url), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexTable)