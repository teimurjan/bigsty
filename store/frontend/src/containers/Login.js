import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../actions/login';
import Login from "../components/Login";

function mapStateToProps(state){
    return state.login;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)