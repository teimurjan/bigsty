import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin-categories';
import AdminCategories from "../../components/admin/AdminCategories";

function mapStateToProps(state){
    return state.adminCategories
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories)