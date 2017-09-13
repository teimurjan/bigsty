import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {getAdminTableActions} from '../../actions/admin/admin-table';
import AdminTable from "../../components/Admin/Common/AdminTable";
import {USERS_ACTION_PREFIX, USERS_BASE_URL, USERS_COL_PROPS, USERS_INTL_PREFIX} from "./constants";

function mapStateToProps(state) {
  return {
    ...state.adminUsers,
    intlPrefix: USERS_INTL_PREFIX,
    colProps: USERS_COL_PROPS
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      getAdminTableActions(USERS_ACTION_PREFIX,
      USERS_BASE_URL), dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminTable)