import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Registration from './Registration';
import * as RegistrationActions from './RegistrationActions';


function mapStateToProps(state) {
  return state.registration.toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RegistrationActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration)