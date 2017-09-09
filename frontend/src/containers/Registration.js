import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import * as actions from '../actions/registration';
import Registration from "../components/Registration";

function mapStateToProps(state){
    return state.registration;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)