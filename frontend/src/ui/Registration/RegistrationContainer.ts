import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Registration from './Registration';
import RegistrationActionCreators from './actions';
import { RootState } from '../../rootReducer';

function mapStateToProps(state: RootState) {
  return state.registration.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators(RegistrationActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);