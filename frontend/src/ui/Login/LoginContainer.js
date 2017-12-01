import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import Login from './Login';
import * as LoginActions from './LoginActions';


function mapStateToProps(state) {
  return state.login.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(LoginActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)