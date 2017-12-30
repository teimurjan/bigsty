import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import AddUser, { AddUserNotStateProps } from './AddUser';
import { RootState } from '../../../../rootReducer';
import addUserActionCreators, { AddUserActionCreatorsMapObject } from './actions';
import { AddUserState } from './reducer';

function mapStateToProps(state: RootState) {
  return state.adminAddUser.toJS();
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators<AddUserActionCreatorsMapObject>(addUserActionCreators, dispatch)
  };
}

export default connect<AddUserState, { actions: AddUserActionCreatorsMapObject },
  AddUserNotStateProps>(mapStateToProps, mapDispatchToProps)(AddUser);