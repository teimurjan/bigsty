import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import UsersIndex from './UsersIndex';
import { RootState } from '../../../../rootReducer';
import UsersIndexActions from './UsersIndexActions';

function mapStateToProps(state: RootState) {
  return state.adminUsersIndex.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators(UsersIndexActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersIndex);