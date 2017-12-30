import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Users from './Users';
import { RootState } from '../../../../rootReducer';
import usersActionCreators from './actions';

function mapStateToProps(state: RootState) {
  return state.adminUsers.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators(usersActionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Users);