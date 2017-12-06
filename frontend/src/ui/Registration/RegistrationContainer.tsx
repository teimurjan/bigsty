import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Registration from './Registration';
import { RegistrationActions } from './RegistrationActions';
import { RootState } from '../../rootReducer';

function mapStateToProps(state: RootState) {
  return state.registration.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators(RegistrationActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);