import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin-product-creation';
import AdminProductCreation from "../../components/admin/AdminProductCreation";

function mapStateToProps(state){
    return state.adminProductCreation
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProductCreation)