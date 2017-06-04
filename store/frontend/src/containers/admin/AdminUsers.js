import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin-users';
import AdminUsers from "../../components/admin/AdminUsers";

function mapStateToProps(state){
    return state.adminUsers
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers)