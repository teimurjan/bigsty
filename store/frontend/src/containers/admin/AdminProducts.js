import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../../actions/admin-products';
import AdminProducts from "../../components/admin/AdminProducts";

function mapStateToProps(state){
    return state.adminProducts
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminProducts)