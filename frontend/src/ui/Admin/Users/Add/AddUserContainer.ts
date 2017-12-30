import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AddUser from './AddUser';
import { RootState } from '../../../../rootReducer';
import addUserActionCreators from './actions';

function mapStateToProps(state: RootState) {
  return state.adminAddUser.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators(addUserActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);