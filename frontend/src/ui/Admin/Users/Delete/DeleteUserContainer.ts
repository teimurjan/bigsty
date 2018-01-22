import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import DeleteUser from './DeleteUser';
import { RootState } from '../../../../rootReducer';
import deleteUserActionCreators, { DeleteUserActionCreatorsMapObject } from './actions';
import { DeleteUserState } from './reducer';

function mapStateToProps(state: RootState) {
  const props = state.adminDeleteUser.toJS();
  return {...props, isOpen: props.userId !== undefined};
}

function mapDispatchToProps(dispatch: Dispatch<RootState>) {
  return {
    actions: bindActionCreators<DeleteUserActionCreatorsMapObject>(deleteUserActionCreators, dispatch)
  };
}

export default (
  connect<DeleteUserState & { isOpen: boolean }, { actions: DeleteUserActionCreatorsMapObject }>
  (mapStateToProps, mapDispatchToProps)(DeleteUser)
);