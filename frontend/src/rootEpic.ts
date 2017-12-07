import { combineEpics } from 'redux-observable';
import loginEpics from './ui/Login/LoginEpics';
import registrationEpics from './ui/Registration/RegistrationEpics';
import adminUsersIndexEpics from './ui/Admin/Users/Index/UsersIndexEpics';

export default combineEpics(
  ...loginEpics,
  ...registrationEpics,
  ...adminUsersIndexEpics
);
