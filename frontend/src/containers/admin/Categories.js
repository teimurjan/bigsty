import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {getAdminTableActions} from '../../actions/admin/admin-table';
import IndexTable from "../../components/Admin/Common/AdminTable";
import {CATEGORIES_ACTION_PREFIX, CATEGORIES_BASE_URL, CATEGORIES_COL_PROPS, CATEGORIES_INTL_PREFIX} from "./constants";

function mapStateToProps(state) {
  return {
    ...state.adminCategories,
    intlPrefix: CATEGORIES_INTL_PREFIX,
    colProps: CATEGORIES_COL_PROPS
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      getAdminTableActions(CATEGORIES_ACTION_PREFIX,
        CATEGORIES_BASE_URL
      ), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexTable)