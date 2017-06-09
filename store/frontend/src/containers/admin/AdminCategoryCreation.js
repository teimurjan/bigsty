import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin-category-creation';
import AdminCategoryCreation from "../../components/admin/AdminCategoryCreation";

function mapStateToProps(state){
    return state.adminCategoryCreation
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategoryCreation)