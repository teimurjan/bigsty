import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from 'redux';
import Login from './Login';
import {RootState} from "../../rootReducer";
import {changeEmail, changePassword, submit} from "./LoginActions";


function mapStateToProps(state: RootState) {
  return state.login.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators({changeEmail, changePassword, submit}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)